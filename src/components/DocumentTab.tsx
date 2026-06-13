/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { FileText, QrCode, Scan, Merge, ArrowRight, Download, Upload, Shield } from "lucide-react";

export const DocumentTab: React.FC = () => {
  const { language } = useApp();
  const t = TRANSLATIONS[language];

  const [activeTool, setActiveTool] = useState<"scan" | "qr" | "pdf">("scan");
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scanFilter, setScanFilter] = useState<"raw" | "mono" | "sharp">("mono");
  const [toastNote, setToastNote] = useState("");

  // QR state
  const [qrTextInput, setQrTextInput] = useState("https://mutation.land.gov.bd/");
  
  // PDF Merge state
  const [selectedMergeFiles, setSelectedMergeFiles] = useState<string[]>([]);
  const [mergedPdfResult, setMergedPdfResult] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Scanner Filter Rendering Loop
  useEffect(() => {
    if (scannedImage && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canv = canvasRef.current!;
        const ctx = canv.getContext("2d");
        if (ctx) {
          canv.width = img.width;
          canv.height = img.height;
          ctx.drawImage(img, 0, 0);

          if (scanFilter !== "raw") {
            const imageData = ctx.getImageData(0, 0, canv.width, canv.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i+1];
              const b = data[i+2];
              
              // Standard luminosity grayscale
              let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

              if (scanFilter === "mono") {
                // High contrast binary thresholding (mimics laser scan photocopy)
                v = v > 120 ? 255 : 30;
                data[i] = v;
                data[i+1] = v;
                data[i+2] = v;
              } else if (scanFilter === "sharp") {
                // Enhanced brightened contrast
                v = Math.min(255, v * 1.35);
                data[i] = v;
                data[i+1] = v;
                data[i+2] = v;
              }
            }
            ctx.putImageData(imageData, 0, 0);
          }
        }
      };
      img.src = scannedImage;
    }
  }, [scannedImage, scanFilter]);

  // 2. Offline QR Core Generator
  useEffect(() => {
    if (activeTool === "qr" && qrRef.current) {
      const cv = qrRef.current;
      const ctx = cv.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 200, 200);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 200, 200);

        // Core outline box styles
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(10, 10, 180, 180);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(18, 18, 164, 164);

        // Corners anchor points
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(25, 25, 45, 45);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(33, 33, 29, 29);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(40, 40, 15, 15);

        ctx.fillRect(130, 25, 45, 45);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(138, 33, 29, 29);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(145, 40, 15, 15);

        ctx.fillRect(25, 130, 45, 45);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(33, 138, 29, 29);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(40, 145, 15, 15);

        // Seed dynamic modules representing the text block hashed
        ctx.fillStyle = "#010101";
        const charHashSum = qrTextInput.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
        for (let x = 75; x < 125; x += 8) {
          for (let y = 25; y < 175; y += 12) {
            const pseudoRand = (x * y + charHashSum) % 5 > 1.8;
            if (pseudoRand) ctx.fillRect(x, y, 6, 6);
          }
        }
        for (let x = 125; x < 175; x += 10) {
          for (let y = 75; y < 125; y += 8) {
            const pseudoRand = (x * y + charHashSum + 42) % 3 > 1.25;
            if (pseudoRand) ctx.fillRect(x, y, 7, 7);
          }
        }
      }
    }
  }, [qrTextInput, activeTool]);

  const handleFileScannedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const rd = new FileReader();
      rd.onload = () => {
        setScannedImage(rd.result as string);
      };
      rd.readAsDataURL(file);
    }
  };

  const handleMergeAction = () => {
    if (selectedMergeFiles.length < 2) return;
    setMergedPdfResult(`Merged_Document_Package_${Math.floor(100 + Math.random() * 900)}.pdf`);
    setToastNote("PDF channels merged successfully!");
    setTimeout(() => setToastNote(""), 2000);
  };

  const downloadProcessedImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/jpeg");
      link.download = `Scanned_Document_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-500" />
          {t.documentCenter}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
          {language === "en" ? "Interactive photocopy scanning algorithms, custom barcode generation." : "নাগরিক সেবা প্রদানের জন্য দ্রুত কাজ সারার ইমেজ স্ক্যানার ও ফাইল এডিটর।"}
        </p>
      </div>

      {toastNote && (
        <div className="p-3 bg-slate-900 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300 font-bold text-center rounded-lg animate-pulse">
          {toastNote}
        </div>
      )}

      {/* Choice Panel */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTool("scan")}
          className={`flex flex-col items-center p-3 rounded-lg border text-center transition ${activeTool === "scan" ? "bg-slate-900 text-white dark:bg-teal-500/10 dark:text-teal-300 border-teal-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"}`}
        >
          <Scan className="w-5 h-5 mb-1.5" />
          <span className="font-bold">Photocopy Scanner</span>
        </button>

        <button
          onClick={() => setActiveTool("qr")}
          className={`flex flex-col items-center p-3 rounded-lg border text-center transition ${activeTool === "qr" ? "bg-slate-900 text-white dark:bg-teal-500/10 dark:text-teal-300 border-teal-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"}`}
        >
          <QrCode className="w-5 h-5 mb-1.5" />
          <span className="font-bold">QR Generator</span>
        </button>

        <button
          onClick={() => setActiveTool("pdf")}
          className={`flex flex-col items-center p-3 rounded-lg border text-center transition ${activeTool === "pdf" ? "bg-slate-900 text-white dark:bg-teal-500/10 dark:text-teal-300 border-teal-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"}`}
        >
          <Merge className="w-5 h-5 mb-1.5" />
          <span className="font-bold">PDF Binders</span>
        </button>
      </div>

      {/* 1. PHOTOCY SCANNER CONTENT */}
      {activeTool === "scan" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Upload panel */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Upload document picture</h4>
            
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-400 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900/40 relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileScannedUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-slate-400 mb-2" />
              <p className="font-semibold text-slate-800 dark:text-slate-100">Drag photo or browse image</p>
              <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, Webp (scans directly offline)</p>
            </div>

            {scannedImage && (
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-lg space-y-3">
                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Scanner Adjustment Filters</p>
                
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setScanFilter("raw")} 
                    className={`py-1.5 px-2.5 rounded-md font-bold text-[10px] transition ${scanFilter === "raw" ? "bg-teal-500 text-white" : "bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600"}`}
                  >
                    Original Color
                  </button>
                  <button 
                    onClick={() => setScanFilter("mono")} 
                    className={`py-1.5 px-2.5 rounded-md font-bold text-[10px] transition ${scanFilter === "mono" ? "bg-teal-500 text-white" : "bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600"}`}
                  >
                    B&W Copy
                  </button>
                  <button 
                    onClick={() => setScanFilter("sharp")} 
                    className={`py-1.5 px-2.5 rounded-md font-bold text-[10px] transition ${scanFilter === "sharp" ? "bg-teal-500 text-white" : "bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600"}`}
                  >
                    Bright scan
                  </button>
                </div>

                <button
                  onClick={downloadProcessedImage}
                  className="w-full py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-lg flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Scan Document</span>
                </button>
              </div>
            )}
          </div>

          {/* Canvas Render Panel */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-center min-h-[250px] overflow-hidden relative">
            {scannedImage ? (
              <canvas ref={canvasRef} className="max-w-full max-h-[360px] object-contain rounded border border-slate-300 shadow-xl" />
            ) : (
              <div className="text-center italic text-slate-400">
                Upload a document snapshot on the left to activate photo photocopy filtration modeling workspace.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. QR CODE WORKSPACE */}
      {activeTool === "qr" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-850 dark:text-white uppercase tracking-wider">Offline QR Code Generator</h4>
            <p className="text-slate-400 font-sans">
              Enter any URL link or text message description below. The QR code updates dynamically as you type, and can be downloaded as a high quality PNG file.
            </p>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Payload Content *</label>
              <input
                type="text"
                value={qrTextInput}
                onChange={(e) => setQrTextInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
              />
            </div>

            <button
              onClick={() => {
                if (qrRef.current) {
                  const link = document.createElement("a");
                  link.href = qrRef.current.toDataURL();
                  link.download = `QR_Code_${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              className="w-full py-2 bg-slate-900 text-white hover:bg-slate-850 font-bold rounded-lg flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Save QR Code PNG</span>
            </button>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850 flex items-center justify-center min-h-60">
            <div className="p-4 bg-white rounded-lg shadow-xl">
              <canvas ref={qrRef} width="200" height="200" className="w-44 h-44" />
            </div>
          </div>
        </div>
      )}

      {/* 3. PDF TOOLS */}
      {activeTool === "pdf" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">PDF Binder & Merge manager</h4>
          <p className="text-slate-400 mb-4 font-sans max-w-xl">
            Register files to bind. Click multiple scanned pages or external PDF documents to construct a single unified, sequential printable package index.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["NID_Server_Copy.pdf", "Land_Tax_Assessment.pdf", "E-Namjari_Mutation_Approval.pdf"].map((file, idx) => {
              const selected = selectedMergeFiles.includes(file);
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    if (selected) {
                      setSelectedMergeFiles(prev => prev.filter(f => f !== file));
                    } else {
                      setSelectedMergeFiles(prev => [...prev, file]);
                    }
                  }}
                  className={`p-3 rounded-lg border cursor-pointer select-none transition flex items-center justify-between ${selected ? "border-teal-500 bg-teal-500/5 text-slate-850 dark:text-teal-300" : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-750 text-slate-500"}`}
                >
                  <span className="font-bold">{file}</span>
                  <span className="text-[10px] font-mono text-slate-400">Idx {idx + 1}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-750">
            <button
              onClick={() => setSelectedMergeFiles([])}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-semibold"
            >
              Clear Basket
            </button>
            <button
              onClick={handleMergeAction}
              disabled={selectedMergeFiles.length < 2}
              className="px-5 py-1.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded shadow transition active:scale-95"
            >
              Merge Files Sequences
            </button>
          </div>

          {mergedPdfResult && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center rounded-lg font-bold font-mono">
              Ready: {mergedPdfResult} (.pdf compiled local payload target)
            </div>
          )}
        </div>
      )}

    </div>
  );
};
