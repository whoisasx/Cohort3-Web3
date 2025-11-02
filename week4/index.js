const { Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } = require('@solana/web3.js')

const publickey = "B7Da6Q4A5AHysDncrkBwXvGUTATrwfVMPrp3MKnJfybX"
const connection = new Connection(clusterApiUrl('devnet'))

async function airdrop(publickey, amount) {
    // request airdrop and return the signature after confirmation
    const airdropSignature = await connection.requestAirdrop(new PublicKey(publickey), amount)

    // Newer web3.js confirmTransaction API requires blockhash and lastValidBlockHeight
    // Get the latest blockhash info and include it when confirming the transaction
    const latest = await connection.getLatestBlockhash()
    await connection.confirmTransaction({
        signature: airdropSignature,
        ...latest,
    })

    return airdropSignature
}

(async () => {
    try {
        const signature = await airdrop(publickey, LAMPORTS_PER_SOL)
        console.log('signature:', signature)
    } catch (err) {
        // Log full error so it's actionable instead of a silent 'error'
        console.error('airdrop failed:', err)
        process.exitCode = 1
    }
})()