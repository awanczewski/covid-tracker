import './App.css';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'
import { TextField, Grid, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import InfoCard from "./components/InfoCard/InfoCard"
import LoadingOverlay from 'react-loading-overlay';
import PieChart from './components/PieChart/PieChart';
import StackedBarChart from './components/StackedBarChart/StackedBarChart';
function App() {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("Global")
  const [countryData, setCountryData] = useState({confirmed: 0, recovered: 0, deaths: 0, lastUpdate: new Date()})
  const [vaccinesData, setVaccinesData] = useState({vaccinated: 0, partiallyVaccinated: 0, lastUpdate: new Date()})
  const [historyData, setHistoryData] = useState({dates: [], confirmed: [], recovered: [], deaths: []})

  const [loading, setLoading] = useState(true)


  useEffect(() => {
      axios.get("https://covid-api.mmediagroup.fr/v1/cases")
      .then((response) => {
        const casesCountries = Object.keys(response.data)
        axios.get("https://covid-api.mmediagroup.fr/v1/vaccines")
        .then((response) => {
          const vaccinesCountries = Object.keys(response.data)
          const countries = vaccinesCountries.filter(value => casesCountries.includes(value))
          setCountries(countries)
          fetchCountryData(country)
        })
      })    
  }, [])

  const onCountryChange = (event, newValue) => {
    if(newValue !== null)
    {
      setLoading(true)
      fetchCountryData(newValue)
    }
  }

  const fetchCountryData = (countryName) => {
    axios.get(`https://covid-api.mmediagroup.fr/v1/cases?country=${countryName}`)
    .then((response) => {
      const countryCases = {
        confirmed: response.data["All"].confirmed,
        recovered: response.data["All"].recovered,
        deaths: response.data["All"].deaths,
        lastUpdate: (response.data["All"].updated === undefined ? new Date() : response.data["All"].updated)
      }
      axios.get(`https://covid-api.mmediagroup.fr/v1/vaccines?country=${countryName}`)
      .then((response) => {
        const countryVaccines = {
          vaccinated: response.data["All"].people_vaccinated,
          partiallyVaccinated: response.data["All"].people_partially_vaccinated,
          lastUpdate: (response.data["All"].updated === undefined ? new Date() : response.data["All"].updated)
        }
        axios.get(`https://covid-api.mmediagroup.fr/v1/history?country=${countryName}&status=confirmed`)
        .then((response) => {
          const countryConfirmedHistory = Object.entries(response.data["All"].dates).slice(0, 6)
          axios.get(`https://covid-api.mmediagroup.fr/v1/history?country=${countryName}&status=recovered`)
          .then((response) => {
            const countryRecoveredHistory = Object.entries(response.data["All"].dates).slice(0, 6)
            axios.get(`https://covid-api.mmediagroup.fr/v1/history?country=${countryName}&status=deaths`)
            .then((response) => {
              const countryDeathsHistory = Object.entries(response.data["All"].dates).slice(0, 6)
              setCountry(countryName)
              setVaccinesData(countryVaccines)
              setCountryData(countryCases)
              setHistoryData(countDailyNewCases(countryConfirmedHistory, countryRecoveredHistory, countryDeathsHistory))
              setLoading(false)
            })
          })
        })
      })
    })
  }

  const countDailyNewCases = (countryConfirmedHistory, countryRecoveredHistory, countryDeathsHistory) => {
    const countryHistory = {dates: [], confirmed: [], recovered: [], deaths: []}
    for(var i = 5; i > 0; i--)
    {
      countryHistory.dates.push(countryConfirmedHistory[i - 1][0])
      countryHistory.confirmed.push(countryConfirmedHistory[i - 1][1] - countryConfirmedHistory[i][1])
      countryHistory.recovered.push(countryRecoveredHistory[i - 1][1] - countryRecoveredHistory[i][1])
      countryHistory.deaths.push(countryDeathsHistory[i - 1][1] - countryDeathsHistory[i][1])
    }
    return countryHistory
  }

  return (
    <div className="App">

      <Grid container spacing={3} className="App">

        <Grid item xs={12} sm={8}>

          <Grid container spacing={3} className="left">
            <Grid container spacing={3} className="header" alignItems="center">

              <Grid item xs={12} sm={8}>
                <Typography align="center" variant="h3">
                  Covid-Tracker
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Autocomplete
                  className="countries-box"
                  value={country}
                  onChange={(event, newValue) => {
                    onCountryChange(event, newValue)
                  }}
                  id="countries-box"
                  options={countries}
                  renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} className="info-cards" alignItems="center">
              <InfoCard 
                title="Confirmed"
                value={countryData.confirmed}
                lastUpdate={countryData.lastUpdate}
                subtitle="The number of COVID-19 infection cases"
                className="confirmed"
                sm={4}
              />
              <InfoCard 
                title="Recovered"
                value={countryData.recovered}
                lastUpdate={countryData.lastUpdate}
                subtitle="Number of recoveries from COVID-19"
                className="recovered"
                sm={4}
              />
              <InfoCard 
                title="Deaths"
                value={countryData.deaths}
                lastUpdate={countryData.lastUpdate}
                subtitle="Number of deaths due to COVID-19"
                className="deaths"
                sm={4}
              />

              <Grid item xs={12} sm={12}>
              <LoadingOverlay
                active={loading}
                spinner
                text='Loading COVID data'
              >
                {useMemo(() => <PieChart
                    confirmed={countryData.confirmed}
                    recovered={countryData.recovered}
                    deaths={countryData.deaths}
                    country={country}
                  />, [countryData.confirmed, countryData.recovered, countryData.deaths, country])
                }
              </LoadingOverlay>
              </Grid>  
            </Grid>

          </Grid>

        </Grid>

        <Grid item xs={12} sm={4}>

          <Grid container spacing={3} className="right">
            
            <Grid item xs={12}>
              <InfoCard 
                title="Fully vaccinated"
                value={vaccinesData.vaccinated}
                lastUpdate={vaccinesData.lastUpdate}
                subtitle="Number of people fully vaccinated against COVID-19"
                className="vaccines"
                sm={12}
              />
            </Grid>

            <Grid item xs={12}>
              <InfoCard 
                title="Partially vaccinated"
                value={vaccinesData.partiallyVaccinated}
                lastUpdate={vaccinesData.lastUpdate}
                subtitle="Number of people partially vaccinated against COVID-19"
                className="vaccines"
                sm={12}
              />
            </Grid>

            <Grid item xs={12}>
              {useMemo(() => <StackedBarChart
                    dates={historyData.dates}
                    confirmed={historyData.confirmed}
                    recovered={historyData.recovered}
                    deaths={historyData.deaths}
                    country={country}
                  />, [historyData.dates, historyData.confirmed, historyData.recovered, historyData.deaths, country])
              }
            </Grid>

          </Grid>
        </Grid>
     
        
      </Grid>
        
        
      
    </div>
  );
}

export default App;
