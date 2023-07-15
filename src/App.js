import './App.css';
import FilterableUsersTable from './components/FilterableUsersTable';

export const config = {
  endpoint: `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`,
  itemsPerPage: 10
};

function App() {
  return (
    <div className="App">
      <FilterableUsersTable />
    </div>
  );
}

export default App;
