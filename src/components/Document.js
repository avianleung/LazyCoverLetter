import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import store from "store";

const Document = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [open, setOpen] = useState("To whom it may concern");
  const [blocks, setBlocks] = useState([""]);
  const [close, setClose] = useState("Sincerely");
  const [del, setDel] = useState(false);
  const [save, setSave] = useState(false);

  useEffect(() => {
    if (store.get("name")) {
      setName(store.get("name"));
    }
    if (store.get("number")) {
      setNumber(store.get("number"));
    }
    if (store.get("email")) {
      setEmail(store.get("email"));
    }
    if (store.get("blocks")) {
      setBlocks(store.get("blocks"));
    }
    if (store.get("open")) {
      setOpen(store.get("open"));
    }
    if (store.get("close")) {
      setClose(store.get("close"));
    }
  }, []);

  const addBlock = () => {
    let block = [...blocks];
    block.push("");
    setBlocks(block);
  };

  const delBlock = (index) => {
    let block = [...blocks];
    block.splice(index, 1);
    setBlocks(block);
  };

  const editBlock = (index, value) => {
    console.log(index, value);
    let block = [...blocks];
    block[index] = value;
    setBlocks(block);
  };

  const saveData = () => {
    setSave(true);
    store.set("name", name);
    store.set("number", number);
    store.set("email", email);
    store.set("blocks", blocks);
    store.set("open", open);
    store.set("close", close);

    setTimeout(function () {
      setSave(false);
    }, 3000);
  };

  const clearData = () => {
    store.clearAll();
    window.location.reload(false);
  };

  const pdfDownload = () => {
    const replaceWords = (string) => {
      var newString = "";
      newString = string.replace("<company>", company);
      newString = string.replace("<position>", position.toLowerCase());
      return newString;
    };

    var doc = new jsPDF();
    doc.setFontSize(12);

    //header
    doc.text(name, 185, 30, { align: "right" });
    doc.text(number, 185, 36, { align: "right" });
    doc.text(email, 185, 42, { align: "right" });

    //Company and Position
    doc.text("To: " + company, 25, 54, { align: "left" });
    doc.text("RE: " + position, 25, 60, { align: "left" });

    //Greeting
    doc.text(open + ",", 25, 72, { align: "left" });

    //Main Text
    let topMargin = 84;
    for (let index = 0; index < blocks.length; index++) {
      doc.text(replaceWords(blocks[index]), 25, topMargin, {
        align: "left",
        maxWidth: 160,
      });
      topMargin += Math.ceil(
        (doc.getTextDimensions(blocks[index]).w / 160) * 6 + 6
      );
    }

    //Close
    doc.text(close + ",", 25, topMargin, { align: "left" });
    doc.text(name, 25, topMargin + 6, { align: "left" });

    //Download
    doc.autoPrint({ variant: "non-conform" });
    doc.output("dataurlnewwindow", company + ".pdf");
  };

  return (
    <div className='container-fluid'>
      {del && (
        <div>
          <div className='popup-bg'></div>
          <div className='popup'>
            <div className='card popup-card'>
              <div className='card-body'>
                <h5>Confirm Data Delete</h5>
                <p className='mt-3'>Are you sure you want to clear all data?</p>
                <div className='mt-4 d-flex justify-content-end'>
                  <button
                    className='btn btn-sm btn-dark mr-3'
                    onClick={() => setDel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className='btn btn-sm btn-dark'
                    onClick={() => {
                      clearData();
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='row mb-2'>
        <div className='col'>
          <h1>Lazy Cover Letter</h1>
        </div>
      </div>
      <div className='row mb-1'>
        <div className='col-1 mr-5'>Name:</div>
        <input
          className='col-3'
          type='text'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className='row mb-1'>
        <div className='col-1 mr-5'>Phone:</div>
        <input
          className='col-3'
          type='text'
          value={number}
          onChange={(e) => {
            setNumber(e.target.value);
          }}
        />
      </div>
      <div className='row mb-1'>
        <div className='col-1 mr-5'>Email:</div>
        <input
          className='col-3'
          type='email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className='row mb-1'>
        <div className='col-1 mr-5'>Company:</div>
        <input
          className='col-3'
          type='text'
          value={company}
          onChange={(e) => {
            setCompany(e.target.value);
          }}
        />
      </div>
      <div className='row mb-4'>
        <div className='col-1 mr-5'>Position:</div>
        <input
          className='col-3'
          type='text'
          value={position}
          onChange={(e) => {
            setPosition(e.target.value);
          }}
        />
      </div>
      <div className='row'>
        <div className='col-1 mr-5'>Open:</div>
        <input
          className='col-3'
          type='text'
          value={open}
          onChange={(e) => {
            setOpen(e.target.value);
          }}
        />
      </div>

      <div className='row mt-4'>
        <div className='col'>
          {
            "* Replace the company name with <company> and the position with <position> in your paragraphs."
          }
        </div>
      </div>

      {blocks.map((block, idx) => (
        <div className='row'>
          <div className='col-1 mr-5 mt-3'>
            {"Paragraph " + (idx + 1) + ":"}
          </div>
          <textarea
            className='col-9 mt-3'
            rows='4'
            cols='100'
            onChange={(e) => editBlock(idx, e.target.value)}
            value={block}
          ></textarea>
          <input
            type='button'
            className='btn btn-outline-danger mt-3 ml-2'
            onClick={() => delBlock(idx)}
            defaultValue='X'
          />
        </div>
      ))}
      <div className='row'>
        <div className='col-1 mr-5'></div>
        <input
          type='button'
          className='btn btn-primary col-9 mt-2'
          onClick={() => addBlock()}
          defaultValue='+'
        />
      </div>
      <div className='row mt-4 mb-3'>
        <div className='col-1 mr-5'>Close:</div>
        <input
          className='col-3'
          type='text'
          value={close}
          onChange={(e) => {
            setClose(e.target.value);
          }}
        />
      </div>
      <div className='row ml-2'>
        <input
          type='button'
          className='btn mt-3 mr-3 btn-outline-dark'
          onClick={() => setDel(true)}
          defaultValue='Clear Data'
        />
        <input
          type='button'
          className='btn btn-outline-dark mt-3 mr-3'
          onClick={() => saveData()}
          defaultValue='Save for Later'
        />
        <input
          type='button'
          className='btn btn-dark mt-3'
          onClick={() => pdfDownload()}
          defaultValue='Download'
        />
      </div>
      {save && (
        <div className='row justify-content-md-center'>
          <input
            type='button'
            className='btn btn-success mt-5 mb-5 col-6'
            disabled
            defaultValue='Successfully Saved'
          />
        </div>
      )}
    </div>
  );
};

export default Document;
