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

const URL = 'http://localhost:8080/api/'

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
        {title: 'Name', field: 'tournamentName' },
      ],
      data_tournaments: [
      ],
      columns_matches: [
        {title: "ID", field: 'match_id', editable: 'never'},
        {title: 'Name', field: 'match_name' },
        {title: 'Date', field: 'match_date' }
      ],
      data_matches: [],
      selected: true,
      selectedRowId: localStorage.getItem("selectedRow"),
      currentRow: {},
      selectedTournamentId: null
    };
}

componentDidMount () {
  this.getTournaments();
  if(localStorage.getItem("selected")){
    this.getMatches(Number.parseInt(localStorage.getItem("selected")))
  }
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
  window.location.reload();
}

updateTournament (data){
  var patch_data = { tournament_name: data.tournamentName }
  axios.patch(URL + "tournaments/" + data.tournamentId, patch_data)
  window.location.reload();
}

deleteTournament (data){
  axios.delete(URL + "tournaments/" + data.tournamentId)
  if(localStorage.getItem("selected") && localStorage.getItem("selected") === data.tournamentId){
    localStorage.removeItem("selected")
    localStorage.removeItem("selectedRow")
  }
  window.location.reload();
  
}

getMatches (id){
  axios.get(URL + id +"/matches")
    .then(res => 
      this.setState({
        data_matches: res.data
      })
      )
}

addMatch (data) {
  console.log(data)
  var post_data = { match_date: data.match_date, match_name: data.match_name}
  var tId = localStorage.getItem("selected");
  console.log(tId)
  axios.post(URL + tId + "/matches", post_data)
  window.location.reload();
}

updateMatch (data){
  console.log(data)
  var tId = localStorage.getItem("selected");
  var patch_data = { match_date: data.match_date, match_name: data.match_name}
   axios.patch(URL + tId + "/matches/" + data.match_id, patch_data)
   window.location.reload();
}

deleteMatch (data){
  var tId = localStorage.getItem("selected");
  axios.delete(URL + tId + "/matches/" + data.match_id)
  window.location.reload();
}

  render() {
    return(
    <div className="App">
      <div style={{ maxWidth: '100%' }}>
            <MaterialTable
              options={{
                rowStyle: rowData => ({
                  backgroundColor: rowData.tableData.id === Number.parseInt(localStorage.getItem("selectedRow"))
                      ? "#9bb8b3"
                      : "#fff" 
                  })
                
              }}
              icons={tableIcons}
              title="Tournaments"
              columns={this.state.columns_tournaments}
              data={Array.from(this.state.data_tournaments)}
            
            onRowClick={(event, rowData) => {
              this.setState({ 
                  currentRow: rowData, 
                  selected: !this.state.selected,
                  selectedRowId: rowData.tableData.id,
                  selectedTournamentId: rowData.tournamentId
                });
              this.getMatches(rowData.tournamentId)
              localStorage.setItem("selected", rowData.tournamentId)
              localStorage.setItem("selectedRow", rowData.tableData.id)
              console.log(localStorage.getItem("selectedRow"))

            }}
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      this.addTournament(newData);
                      resolve()
                    }, 1000)
                 }),

                onRowUpdate: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      this.updateTournament(newData);
                      resolve()
                    }, 1000)
                  }),

                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      this.deleteTournament(oldData);
                      resolve()
                    }, 1000)
                  }),
              }}
            />

            <MaterialTable
              icons={tableIcons}
              title="Matches"
              columns={this.state.columns_matches}
              data={Array.from(this.state.data_matches)}

              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      var tId = localStorage.getItem("selected");
                      this.addMatch(newData);
                      this.getMatches(tId);
                      resolve()
                    }, 1000)
                 }),

                onRowUpdate: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      this.updateMatch(newData)
                      resolve()
                    }, 1000)
                  }),

                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      this.deleteMatch(oldData)
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