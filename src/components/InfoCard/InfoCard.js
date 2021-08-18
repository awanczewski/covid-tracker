import React from "react";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import CountUp from 'react-countup';

function InfoCard({title, value, lastUpdate, subtitle, className, sm}) {
    return (
        <Grid item xs={12} sm={sm}>
            <Card variant="outlined">
                <CardContent className={className + "-card"}>
                    <Typography variant="h6" gutterBottom className={className + "-text"}> 
                        {title}
                    </Typography>

                    <Typography variant="h5">
                        <CountUp start={0} end={value} duration={3} separator=" " />
                    </Typography>

                    <Typography color="textSecondary">
                        {new Date(lastUpdate).toDateString()}
                    </Typography>

                    <Typography variant="body2">
                        {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}


export default InfoCard;