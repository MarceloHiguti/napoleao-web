import Home from './pages/Home/Home';
import { Table } from './pages/Table/Table';

const App = () => {
  return (
    <div className="App">
      <Table>
        <Home />
      </Table>
    </div>
  );
};

export default App;
