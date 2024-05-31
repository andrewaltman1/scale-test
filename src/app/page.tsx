"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [scaleData, setScaleData] = useState("0");

  async function connectToDevice() {
    try {
      const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x1a86 }] });
      console.log("Device:", device);
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      while (device.opened) {
        console.log("Reading data from the device...")
        const result = await device.transferIn(1, 64);
        const decoder = new TextDecoder();
        const scaleReading = decoder.decode(result.data);
        setScaleData(scaleReading);
      }
    } catch (error) {
      console.error("There was an error connecting to the device:", error);
    }
  }

  const handleConnect = () => {
    connectToDevice();
  }

  const handleDisconnect = () => {
    console.log("Disconnecting from device...");
  }

  return (
    <main className="flex min-h-96 flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to the Lego weigh-in kiosk
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
        </div>
      </div>

      <button onClick={handleConnect}>Connect to Device</button>
      <button onClick={handleDisconnect}>Disconnect from Device</button>
      <input value={scaleData} readOnly className="text-black"></input>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </main>
  );
}
