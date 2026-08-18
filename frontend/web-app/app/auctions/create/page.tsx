import Heading from "@/app/components/Heading";
import AuctionForm from "../AuctionForm";

export default function Create() {
  return (
    <div className="mx-auto max-md:max-w-[95%] max-w-[75%] shadow-lg p-10 bg-white rounded-lg">
      <Heading title="Sell your car!" subtitle="Please enter te details of your car" />

      <AuctionForm />
    </div>
  )
}