import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Typography } from "@material-ui/core";

function StackedBarChart({dates, confirmed, recovered, deaths, country}) {

    const data = {
        labels: dates,
        datasets: [
            {
                label: "Confirmed",
                backgroundColor: [
                    "rgba(0, 0, 255, 0.5)"
                ],
                data: confirmed
            },
            {
                label: "Recovered",
                backgroundColor: [
                    "rgba(0, 255, 0, 0.5)"
                ],
                data: recovered
            },
            {
                label: "Deaths",
                backgroundColor: [
                    "rgba(255, 0, 0, 0.5)"
                ],
                data: deaths
            }
        ]
    }

    const options = {
        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              stacked: true,
            },
          ],
        },
      };

    return (
        <Card variant="outlined">
            <Typography variant="h4" className="chart-text-bar"> 
                {"Daily new cases"}
            </Typography>
            <CardContent className="chart-card-bar">
                <Bar data={data} options={options} />
            </CardContent>
        </Card>

    )
}


export default StackedBarChart;