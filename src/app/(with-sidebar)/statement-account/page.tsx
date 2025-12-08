import StatementAccountForm from "../../../components/StatementAccountsForm";
import StatementAccountsTable from "../../../components/StatementAccountsTable";


export default function StatementAccountPage() {
    return(
        <div className="bg-gray-100 min-h-screen">
            <StatementAccountForm/>
            <StatementAccountsTable/>
        </div>
    )
}