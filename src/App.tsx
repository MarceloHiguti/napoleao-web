import { NapoleaoGame } from './pages/NapoleaoGame/NapoleaoGame';
import { Table } from './pages/Table/Table';

const App = () => {
  return (
    <div className="App">
      <Table>
        <NapoleaoGame />
      </Table>
    </div>
  );
};

export default App;
