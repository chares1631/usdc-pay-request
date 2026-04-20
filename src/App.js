import { useState } from "react";
import { createThirdwebClient, getContract, prepareContractCall } from "thirdweb";
import { ConnectButton, useSendTransaction, useActiveAccount } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: "4a48906176c50863b388eef5d93e7af8",
});

const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpc: "https://rpc.testnet.arc.network",
});

const USDC_CONTRACT = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

function PaymentPage(props) {
  var to = props.to;
  var amount = props.amount;
  var memo = props.memo;
  var account = useActiveAccount();
  var sendTx = useSendTransaction();

  function handlePay() {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    var contract = getContract({
      client: client,
      chain: arcTestnet,
      address: USDC_CONTRACT,
    });
    var amountInWei = Math.floor(parseFloat(amount) * 1000000);
    var transaction = prepareContractCall({
      contract: contract,
      method: "function transfer(address to, uint256 amount)",
      params: [to, amountInWei],
    });
    sendTx.mutate(transaction);
    alert("Transaction submitted!");
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>Payment Request</h2>
      <p><strong>To:</strong> {to}</p>
      <p><strong>Amount:</strong> {amount} USDC</p>
      <p><strong>Memo:</strong> {memo}</p>
      <ConnectButton client={client} chain={arcTestnet} />
      <br />
      <button
        onClick={handlePay}
        style={{ marginTop: "16px", padding: "10px 20px", fontSize: "16px", background: "blue", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        Pay Now
      </button>
    </div>
  );
}

function App() {
  var toState = useState("");
  var to = toState[0];
  var setTo = toState[1];

  var amountState = useState("");
  var amount = amountState[0];
  var setAmount = amountState[1];

  var memoState = useState("");
  var memo = memoState[0];
  var setMemo = memoState[1];

  var linkState = useState("");
  var link = linkState[0];
  var setLink = linkState[1];

  function generateLink() {
    var params = new URLSearchParams({ to: to, amount: amount, memo: memo });
    setLink(window.location.origin + "?" + params.toString());
  }

  var query = new URLSearchParams(window.location.search);
  var payTo = query.get("to");
  var payAmount = query.get("amount");
  var payMemo = query.get("memo");

  if (payTo) {
    return <PaymentPage to={payTo} amount={payAmount} memo={payMemo} />;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>Create Payment Request</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Your Wallet Address</label><br />
        <input value={to} onChange={function(e) { setTo(e.target.value); }} style={{ width: "400px", padding: "8px", marginTop: "4px" }} />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Amount (USDC)</label><br />
        <input value={amount} onChange={function(e) { setAmount(e.target.value); }} style={{ width: "400px", padding: "8px", marginTop: "4px" }} />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Memo</label><br />
        <input value={memo} onChange={function(e) { setMemo(e.target.value); }} style={{ width: "400px", padding: "8px", marginTop: "4px" }} />
      </div>
      <button onClick={generateLink} style={{ padding: "10px 20px", fontSize: "16px", background: "green", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        Generate Link
      </button>
      {link && (
        <div style={{ marginTop: "20px", padding: "16px", background: "#f0f0f0", borderRadius: "8px" }}>
          <p><strong>Share this link:</strong></p>
          <a href={link}>{link}</a>
        </div>
      )}
    </div>
  );
}

export default App;