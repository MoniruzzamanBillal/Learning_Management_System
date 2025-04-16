import { paymentColumn } from "./Column";
import DataTable from "./DataTable";
import { dummyPaymentData } from "./DummyData";

const ShowTablePage = () => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={paymentColumn} data={dummyPaymentData} />
    </div>
  );
};

export default ShowTablePage;
