;; Buy a ticket NFT for a fixed price of 50 tokens.
(define-constant TOKEN_PRICE u50)

(define-public (buy-nft)
  (begin
    ;; 1) Transfer 50 tokens from the buyer to THIS contract
    ;; NOTE: Use the literal contract identifier in contract-call? (no constants)
    (try! (as-contract
      (contract-call? .token
        transfer
        TOKEN_PRICE
        tx-sender
        (as-contract tx-sender)
        none)))

    ;; 2) Mint the NFT to the buyer
    (try! (contract-call? .nft
      mint
      tx-sender))

    (ok true)
  )
)
