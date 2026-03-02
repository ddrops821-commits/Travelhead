
"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Home() {
  const [date, setDate] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [amount, setAmount] = useState("");

  const invoiceNumber = "FEABA" + new Date().getTime();

  const downloadPDF = async () => {
    const input = document.getElementById("invoice");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(invoiceNumber + ".pdf");
  };

  return (
    <div style={{padding:30}}>
      <h2>FEABA Travels Invoice Generator</h2>

      <div style={{marginBottom:20}}>
        <input type="date" onChange={e=>setDate(e.target.value)} />
        <input placeholder="Pick Up Location" onChange={e=>setPickup(e.target.value)} style={{marginLeft:10}}/>
        <input placeholder="Drop Location" onChange={e=>setDrop(e.target.value)} style={{marginLeft:10}}/>
        <input placeholder="Amount ₹" onChange={e=>setAmount(e.target.value)} style={{marginLeft:10}}/>
        <button onClick={downloadPDF} style={{marginLeft:10}}>Download PDF</button>
      </div>

      <div id="invoice" style={{background:"#fff",padding:20,border:"1px solid #ccc"}}>
        <h3>FEABA TRAVELS</h3>
        <p>Bommanahalli, Bengaluru Karnataka</p>
        <p>Phone: 98801 59085</p>
        <hr/>

        <h3 style={{textAlign:"right"}}>TAX INVOICE</h3>

        <p><b>Invoice No:</b> {invoiceNumber}</p>
        <p><b>Invoice Date:</b> {date}</p>
        <p><b>Cab Type:</b> Etios</p>
        <p><b>Driver:</b> Sebastian KA644114</p>

        <hr/>

        <p><b>Description:</b></p>
        <p>Cab Service</p>
        <p>{pickup} pick up and {drop} drop</p>

        <hr/>

        <h3>Total: ₹ {amount}</h3>
        <p><b>Balance Due:</b> ₹ {amount}</p>

        <br/>
        <p>Thanks for your business.</p>
      </div>
    </div>
  );
}
