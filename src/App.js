import logo from './logo.svg';
import './App.css';
import Search from "./components/Search";
import {Provider} from "react-redux";
import appStore from './store/store';


function App() {
  return (
      <Provider store={appStore}>
          <div id="container">
            <Search />
          </div>
      </Provider>
  );
}

export default App;
