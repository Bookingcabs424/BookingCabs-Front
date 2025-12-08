import UserSearchForm from "../../../components/UserSearchForm";
import UserTable from "../../../components/UserTable";

export default function UserPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-12">
        <UserSearchForm />
        <UserTable/>
      </div>
    </div>
  );
}
