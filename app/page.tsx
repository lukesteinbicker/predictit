import { LampMain } from "@/components/lamp";
import Link from "next/link";

export default async function Index() {
  return (
      <main className="flex-1 flex flex-col gap-6 px-4">
      <LampMain />
        <div className="p-4 rounded-lg">
          <div className="h-[20rem] flex flex-col justify-start items-center px-4">
            <div className="text-2xl mx-auto font-normal text-muted-foreground mb-20">
              <h2>
                Have you ever been certain that something will happen but don&apos;t have the ability or courage to bet on it? This application records your predictions on the Ethereum network along with their timestamps so you can prove to your friends you came up with that 10-leg parlay BEFORE it hit.
                If you have a bad gambling habit or just want to show others your knack for speculating on stock prices, game outcomes, or any other event, this is perfect for you. <Link href="/sign-up"><u>Sign up and create predictions for free in seconds.</u></Link>
              </h2>
            </div>
            <div className="text-sm mx-auto font-normal text-muted-foreground">
              <p>If you don't want to create an account, <Link href="/manual-transaction"><u>you can still make transations with the contract.</u></Link></p>
            </div>
          </div>
        </div>
      </main>
  );
}
