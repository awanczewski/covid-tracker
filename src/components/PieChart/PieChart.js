import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, Typography } from "@material-ui/core";

function PieChart({confirmed, recovered, deaths}) {

    const data = {
        labels: ["Active", "Recovered", "Deaths"],
        datasets: [
            {
                label: "COVID-19 Cases",
                backgroundColor: [
                    "rgba(255, 120, 0, 0.5)",
                    "rgba(0, 255, 0, 0.5)",
                    "rgba(255, 0, 0, 0.5)"
                ],
                data: [(confirmed - recovered - deaths), recovered, deaths]
            }
        ]
    }

    return (
        <Card variant="outlined">
            <Typography variant="h4" className="chart-text-pie"> 
                {"COVID-19 cases"}
            </Typography>
            <CardContent className="chart-card-pie">

                <Pie
                    data={data}
                    height={500}
                    options={{
                        title:{
                            display: true,
                            text: "COVID-19 Cases",
                            fontSize: 200
                        },
                        legend:{
                            display: true,
                            positions: 'right'
                        },
                        maintainAspectRatio: false,
                    }}
                />
            </CardContent>
        </Card>

    )
}


export default PieChart;