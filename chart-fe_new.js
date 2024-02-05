window.onload = async () => {
    let emissionChartCo2, totalShipments, carbonIntensity, carbonIntensityMode, avgWeight, avgDistance, shipmentEmission, shipmentByMode, avgShipmentLine;

    // Function to fetch data and return a promise
    const fetchData = async (key) => {
        return Wized.data.get(key);
    };

    // Function to create all charts
    const createCharts = (monthData, shipmentModeData) => {
        // Ensure data is not null
        if (!monthData || !shipmentModeData) {
            console.error("Data is missing");
            return;
        }
    };

    // Fetch all necessary data
    try {
        const [monthData, shipmentModeData] = await Promise.all([
            fetchData("v.emissionMonthData"),
            fetchData("v.shipmentByMode")
        ]);

        // Create charts
        createCharts(monthData, shipmentModeData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};



window.onload = async () => {
    let emissionChartCo2; // This will hold the chart instance
    let totalShipments; 
    let carbonIntensity; 
    let carbonIntensityMode; 
    let avgDistance;
    let avgWeight;
    let shipmentEmission;
    let shipmentByMode;
    let avgShipmentLine;
    let monthDataLoaded = false;
    let shipmentModeDataLoaded = false;

Wized.data.listen("v.emissionMonthData", async () => {   
        monthDataLoaded = true;
        console.log(monthDataLoaded, shipmentModeDataLoaded)
        if(monthDataLoaded && shipmentModeDataLoaded){
            createCharts()
        }

});
Wized.data.listen("v.shipmentByMode", async () => {   
    shipmentModeDataLoaded = true;
    console.log('ship' ,monthDataLoaded, shipmentModeDataLoaded)
    if(monthDataLoaded && shipmentModeDataLoaded){
        createCharts()
    }
})

createCharts = async () => {
    console.log("createCharts" , monthDataLoaded, shipmentModeDataLoaded)
    const monthData = await Wized.data.get("v.emissionMonthData");        
        const shipmentModeData = await Wized.data.get("v.shipmentByMode");
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const month_label =  monthData.map(data => monthNames[data.month-1]);


        const emission_data = monthData.map(key=> key.totalEmissions_tCO2e)

        const emissionMode_data = shipmentModeData.map(key=> key.totalEmissions_tCO2e)
        
        
        // Destroy the existing chart if it exists
        if (emissionChartCo2) {
            emissionChartCo2.destroy();
        }

        // Get the canvas context
        const emissionCtx = document.getElementById('emissionChart').getContext('2d');

        // Create a new chart
        emissionChartCo2 = new Chart(emissionCtx, {
            type: 'bar',
            data: {
                labels: shipmentModeData.map(mode => mode.transportMode),
                datasets: [{
                    label: 'Emission Co2e',
                    data: emissionMode_data,
                    backgroundColor: [
                        'rgba(53, 190, 108, 1)',
                    ],
                    borderColor: [
                        'rgba(53, 190, 108, 1)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const shipmentMode_data = shipmentModeData.map(key=> key.shipmentsCount);
        const shipment_data = monthData.map(key=> key.shipmentsCount);

        // Destroy the existing chart if it exists
        if (totalShipments) {
            totalShipments.destroy();
        }

        // Get the canvas context
        const shipmentCtx = document.getElementById('totalShipments').getContext('2d');

        // Create a new chart
        totalShipments = new Chart(shipmentCtx, {
            type: 'bar',
            data: {
                labels: shipmentModeData.map(mode => mode.transportMode),
                datasets: [{
                    label: 'Shipment',
                    data: shipmentMode_data,
                    backgroundColor: [
                        'rgba(53, 190, 108, 1)',
                    ],
                    borderColor: [
                        'rgba(53, 190, 108, 1)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
   

  
    const carbon_data = monthData.map(key=> key.emissionIntensity_gCO2e_tkm);

    // Destroy the existing chart if it exists
    if (carbonIntensity) {
        carbonIntensity.destroy();
    }

    // Get the canvas context
    const carbonIntensityCTX = document.getElementById('carbonIntensityLine').getContext('2d');

    // Create a new chart
    carbonIntensity = new Chart(carbonIntensityCTX, {
        type: 'line',
        data: {
            labels: month_label,
            datasets: [{
                label: 'Carbon Emission',
                data: carbon_data,
                backgroundColor: [
                    'rgba(53, 190, 108, 1)',
                ],
                borderColor: [
                    'rgba(53, 190, 108, 1)',
                ],
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'x',
            
        }
    });


    const carbonIntensityMode_data = shipmentModeData.map(key=> key.emissionIntensity_gCO2e_tkm);

    // Destroy the existing chart if it exists
    if (carbonIntensityMode) {
        carbonIntensitMode.destroy();
    }

    // Get the canvas context
    const carbonIntensityModeCTX = document.getElementById('carbonIntensityMode').getContext('2d');

    // Create a new chart
    carbonIntensityMode = new Chart(carbonIntensityModeCTX, {
        type: 'bar',
        data: {
            labels: shipmentModeData.map(mode => mode.transportMode),
            datasets: [{
                label: 'Carbon Emission',
                data: carbonIntensityMode_data,
                backgroundColor: [
                    'rgba(53, 190, 108, 1)',
                ],
                borderColor: [
                    'rgba(53, 190, 108, 1)',
                ],
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    //const avgweight_data = monthData.map(key=> key.weight_t)
    const avgWeightPerShipment_data = monthData.map(data => data.weight_t / data.shipmentsCount);

    // Destroy the existing chart if it exists
    if (avgWeight) {
        avgWeight.destroy();
    }

    // Get the canvas context
    const weightCtx = document.getElementById('avgWeight').getContext('2d');

    // Create a new chart
    avgWeight = new Chart(weightCtx, {
        type: 'bar',
        data: {
            labels: month_label,
            datasets: [{
                label: 'Average Weight',
                data: avgWeightPerShipment_data,
                backgroundColor: [
                    'rgba(53, 190, 108, 1)',
                ],
                borderColor: [
                    'rgba(53, 190, 108, 1)',
                ],
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
        }
    });
   

    const avgDistancePerShipment_data = monthData.map(data => data.distance_km / data.shipmentsCount);


        // Destroy the existing chart if it exists
        if (avgDistance) {
            avgDistance.destroy();
        }

        // Get the canvas context
        const distanceCtx = document.getElementById('avgDistance').getContext('2d');

        // Create a new chart
        avgDistance = new Chart(distanceCtx, {
            type: 'bar',
            data: {
                labels: month_label,
                datasets: [{
                    label: 'Average Distance',
                    data: avgDistancePerShipment_data,
                    backgroundColor: [
                        'rgba(53, 190, 108, 1)',
                    ],
                    borderColor: [
                        'rgba(53, 190, 108, 1)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        
        // Destroy the existing chart if it exists
        if (shipmentEmission) {
            shipmentEmission.destroy();
        }

        // Get the canvas context
        const shipmentEmissionCtx = document.getElementById('shipmentEmission').getContext('2d');

        // Create a new mixed chart
        shipmentEmission = new Chart(shipmentEmissionCtx, {
            type: 'bar', // This is the default type
            data: {
                labels: month_label,
                datasets: [{
                    label: 'Shipment',
                    data: shipment_data,
                    backgroundColor: 'rgba(53, 190, 108, 1)',
                    borderColor: 'rgba(53, 190, 108, 1)',
                    borderWidth: 1,
                    type: 'bar' // Specify bar type here
                }, {
                    label: 'Emission',
                    data: emission_data,
                    backgroundColor: 'rgba(178, 254, 3, 1)',
                    borderColor: 'rgba(178, 254, 3, 1)',
                    borderWidth: 1,
                    type: 'line', // Specify line type here
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });


        // Destroy the existing chart if it exists
        if (shipmentByMode) {
            shipmentByMode.destroy();
        }

        // Get the canvas context
        const shipmentByModeCtx = document.getElementById('shipmentMode').getContext('2d');
        totalShipmentsCount = shipmentModeData.reduce((total, mode) => total + mode.shipmentsCount, 0);
        const shipmentPercentages = shipmentModeData.map(mode => ({
            transportMode: mode.transportMode,
            percentage: (mode.shipmentsCount / totalShipmentsCount) * 100
        }));

        // Create a new mixed chart
        shipmentByMode = new Chart(shipmentByModeCtx, {
            type: 'doughnut',
            data: {
                labels: shipmentPercentages.map(mode => mode.transportMode),
                datasets: [{
                    label: '% of Shipments',
                    data: shipmentPercentages.map(mode => mode.percentage),
                    backgroundColor: [
                        // Colors for each bar
                        'rgba(178, 254, 3, 1)',
                        'rgba(53, 190, 108, 1)'
                        // Add more colors if you have more transport modes
                    ],
                    borderColor: [
                        // Border colors for each bar
                        'rgba(178, 254, 3, 1)',
                        'rgba(53, 190, 108, 1)'
                        // Add more border colors if needed
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                aspectRatio: 1.8,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }            }
        });



        if (avgShipmentLine) {
            avgShipmentLine.destroy();
        }

        const avgShipmentLinectx = document.getElementById('avgShipmentLineChart').getContext('2d');
avgShipmentLine = new Chart(avgShipmentLinectx, {
    type: 'line',
    data: {
        labels: month_label,
        datasets: [{
            label: 'Avg Weight per Shipment (t)',
            data: avgWeightPerShipment_data,
            backgroundColor: 'rgba(178, 254, 3, 1)',
            borderColor: 'rgba(178, 254, 3, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y-weight' // Associate this dataset with the first y-axis
        }, {
            label: 'Avg Distance per Shipment (km)',
            data: avgDistancePerShipment_data,
            backgroundColor: 'rgba(53, 190, 108, 1)',
            borderColor: 'rgba(53, 190, 108, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y-distance' // Associate this dataset with the second y-axis
        }]
    },
    options: {
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-weight', // First y-axis
                beginAtZero: true
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-distance', // Second y-axis
                beginAtZero: true,

                // Use this to align the two scales
                grid: {
                    drawOnChartArea: false // Only draw the grid for this axis on the right
                }
            }
        }
    }
});

}

}
