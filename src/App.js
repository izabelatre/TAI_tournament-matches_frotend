import React from 'react'
import axios from 'axios';
import MaterialTable from 'material-table'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { forwardRef } from 'react';

URL = 'http://localhost:8080/api/'

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.materialTableRef = React.createRef();
    this.state = {
      
      columns_tournaments: [
        {title: "ID", field: 'tournamentId', editable: 'never'},
        { title: 'Name', field: 'tournamentName' },
        { title: 'Hidden Field', field: 'hiddenfield', hidden: true }
      ],
      data_tournaments: [
        { name: 'Mehmet' },
        { name: 'Zerya Betül'},
      ],
    };
}

componentDidMount () {
  this.getTournaments();
}

getTournaments (){
  axios.get(URL + 'tournaments')
    .then(res => 
      this.setState({
        data_tournaments: res.data
      }
    )
  )
}

addTournament (data) {
  var post_data = { tournament_name: data.tournamentName }
  axios.post(URL + "tournaments", post_data)
  this.getTournaments();
  window.location.reload();
}

updateTournament (data){
  var patch_data = { tournament_name: data.tournamentName }
  axios.patch(URL + "tournaments/" + data.tournamentId, patch_data)
  this.getTournaments();
  window.location.reload();
}

deleteTournament (data){
  axios.delete(URL + "tournaments/" + data.tournamentId)
  this.getTournaments();
  window.location.reload();
}

  render() {
    return(
    <div className="App">
      <div style={{ maxWidth: '100%' }}>
            <MaterialTable
            icons={tableIcons}
              title="Tournaments"
              columns={this.state.columns_tournaments}
              data={Array.from(this.state.data_tournaments)}
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data_tournaments;
                        this.addTournament(newData);
                        this.setState(() => resolve());
                      }
                      resolve()
                    }, 1000)
                 }),

                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        this.updateTournament(newData)
                        this.setState(() => resolve());
                      }
                      resolve()
                    }, 1000)
                  }),

                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        let data = this.state.data_tournaments;
                        const index = data.indexOf(oldData);
                        this.deleteTournament(oldData)
                        this.setState(() => resolve());
                      }
                      resolve()
                    }, 1000)
                  }),
              }}
            />
        </div>
    </div>
    )
  }
}

export default App;