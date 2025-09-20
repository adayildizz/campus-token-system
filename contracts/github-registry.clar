;; ---------- Errors ----------
(define-constant ERR_ALREADY_REGISTERED (err u200))
(define-constant ERR_USERNAME_TAKEN (err u201))
(define-constant ERR_NOT_REGISTERED (err u202))
(define-constant ERR_UNAUTHORIZED (err u203))
(define-constant ERR_BAD_INPUT (err u204))
(define-constant ERR_NOT_INITIALIZED (err u205))

;; ---------- State ----------
(define-map github-to-address (string-ascii 50) principal)
(define-map address-to-github principal (string-ascii 50))
(define-map user-profiles
  principal
  {
    github-username: (string-ascii 50),
    registration-date: uint,
    total-earned: uint,
    total-spent: uint,
    is-active: bool
  }
)

;; Admin (set once) and allowed token contract (optional)
(define-data-var admin (optional principal) none)
(define-data-var token-contract (optional principal) none)

;; ---------- Internal guards ----------
(define-private (require-admin)
  (begin
    (asserts! (is-some (var-get admin)) ERR_NOT_INITIALIZED)
    (asserts!
      (is-eq tx-sender (unwrap! (var-get admin) ERR_NOT_INITIALIZED))
      ERR_UNAUTHORIZED)
    (ok true)
  )
)

(define-private (require-updater)
  (let (
      (is-admin (is-eq tx-sender (default-to tx-sender (var-get admin))))
      (is-token-contract-caller
        (match (contract-caller) caller
          (match (var-get token-contract) token-p
            (is-eq caller token-p)
          )
          false
        )
      )
    )
    (or is-admin is-token-contract-caller)
  )

)

;; ---------- Admin setup ----------
;; Can be called once to set the admin to the caller.
(define-public (init-admin)
  (begin
    (asserts! (is-none (var-get admin)) ERR_UNAUTHORIZED)
    (var-set admin (some tx-sender))
    (ok true)
  )
)

;; Set or change the allowed token contract (admin only).
(define-public (set-token-contract (c principal))
  (begin
    (unwrap! (require-admin) ERR_UNAUTHORIZED)
    (var-set token-contract (some c))
    (ok true)
  )
)

;; ---------- Public functions ----------
(define-public (register-github-user (github-username (string-ascii 50)))
  (let (
      (existing-user (map-get? address-to-github tx-sender))
      (existing-address (map-get? github-to-address github-username))
    )
    ;; basic validation: non-empty and <= 39 chars (GitHub limit)
    (asserts! (> (len github-username) u0) ERR_BAD_INPUT)
    (asserts! (<= (len github-username) u39) ERR_BAD_INPUT)

    (asserts! (is-none existing-user) ERR_ALREADY_REGISTERED)
    (asserts! (is-none existing-address) ERR_USERNAME_TAKEN)

    (map-set github-to-address github-username tx-sender)
    (map-set address-to-github tx-sender github-username)

    (map-set user-profiles tx-sender {
      github-username: github-username,
      registration-date: block-height,
      total-earned: u0,
      total-spent: u0,
      is-active: true
    })
    (ok github-username)
  )
)

;; Allow a user to change their username (releases previous name)
(define-public (change-github-username (new-name (string-ascii 50)))
  (let (
      (current (map-get? address-to-github tx-sender))
      (taken (map-get? github-to-address new-name))
    )
    (asserts! (is-some current) ERR_NOT_REGISTERED)
    (asserts! (> (len new-name) u0) ERR_BAD_INPUT)
    (asserts! (<= (len new-name) u39) ERR_BAD_INPUT)
    (asserts! (is-none taken) ERR_USERNAME_TAKEN)

    (map-delete github-to-address (unwrap! current ERR_NOT_REGISTERED))
    (map-set github-to-address new-name tx-sender)
    (map-set address-to-github tx-sender new-name)

    (match (map-get? user-profiles tx-sender) p
      (map-set user-profiles tx-sender
        (merge p { github-username: new-name }))
      (ok true)
    )
    (ok new-name)
  )
)

;; Deactivate + release the username (keeps profile history)
(define-public (unregister-github)
  (let ((current (map-get? address-to-github tx-sender)))
    (asserts! (is-some current) ERR_NOT_REGISTERED)

    (map-delete github-to-address (unwrap! current ERR_NOT_REGISTERED))
    (map-delete address-to-github tx-sender)

    (match (map-get? user-profiles tx-sender) p
      (map-set user-profiles tx-sender (merge p { is-active: false }))
      (ok true)
    )
    (ok true)
  )
)

;; ---------- Token/accounting updates ----------
(define-public (update-earned-tokens (user principal) (amount uint))
  (begin
    (asserts! (require-updater) ERR_UNAUTHORIZED)
    (let ((p (unwrap! (map-get? user-profiles user) ERR_NOT_REGISTERED)))
      (map-set user-profiles user
        (merge p { total-earned: (+ (get total-earned p) amount) }))
      (ok amount)
    )
  )
)

(define-public (update-spent-tokens (user principal) (amount uint))
  (begin
    (asserts! (require-updater) ERR_UNAUTHORIZED)
    (let ((p (unwrap! (map-get? user-profiles user) ERR_NOT_REGISTERED)))
      (map-set user-profiles user
        (merge p { total-spent: (+ (get total-spent p) amount) }))
      (ok amount)
    )
  )
)

;; ---------- Read-only ----------
(define-read-only (get-address-by-github (github-username (string-ascii 50)))
  (map-get? github-to-address github-username)
)

(define-read-only (get-github-by-address (user-address principal))
  (map-get? address-to-github user-address)
)

(define-read-only (get-user-profile (user-address principal))
  (map-get? user-profiles user-address)
)

(define-read-only (is-user-registered (user-address principal))
  (is-some (map-get? address-to-github user-address))
)