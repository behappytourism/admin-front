import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "../../axios";

export const fetchGeneralData1 = createAsyncThunk(
    "generalSlice/fetchGeneralData1",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.get("/general/1", {
            headers: {
                authorization: `Bearer ${jwtToken}`,
            },
        });
        return response.data;
    }
);
export const fetchGeneralData2 = createAsyncThunk(
    "generalSlice/fetchGeneralData2",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.get("/general/2", {
            headers: {
                authorization: `Bearer ${jwtToken}`,
            },
        });
        return response.data;
    }
);

export const fetchOrderData = createAsyncThunk(
    "generalSlice/fetchOrderData",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.get("/orders/count", {
            headers: {
                authorization: `Bearer ${jwtToken}`,
            },
        });
        return response.data;
    }
);

const UAE_FLAG =
    "https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/ae.svg";

const initialState = {
    isGeneralLoading: true,
    countries: [],
    states: [],
    cities: [],
    areas: [],
    destinations: [],
    drivers: [],
    currencies: [],
    selectedCurrency: localStorage.getItem("currency")
        ? JSON.parse(localStorage.getItem("currency"))
        : {
              isocode: "AED",
              conversionRate: 1,
              flag: UAE_FLAG,
          },
    b2bOrderCount: 0,
    b2cOrderCount: 0,
};

export const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        addCountry: (state, action) => {
            state.countries?.unshift(action.payload);
        },
        deleteCountry: (state, action) => {
            const filteredCountries = state.countries.filter((country) => {
                return country?._id !== action.payload;
            });
            state.countries = filteredCountries;
        },
        updateCountry: (state, action) => {
            const objIndex = state.countries?.findIndex((country) => {
                return country?._id === action.payload?._id;
            });
            state.countries[objIndex] = action.payload;
        },
        addDestination: (state, action) => {
            state.destinations?.unshift(action.payload);
        },
        deleteDestination: (state, action) => {
            const filteredDestinations = state.destinations.filter(
                (destination) => {
                    return destination?._id !== action.payload;
                }
            );
            state.destinations = filteredDestinations;
        },
        updateDestination: (state, action) => {
            const objIndex = state.destinations?.findIndex((destination) => {
                return destination?._id === action.payload?._id;
            });
            state.destinations[objIndex] = action.payload;
        },
        addDriver: (state, action) => {
            state.drivers?.unshift(action.payload);
        },
        deleteDriver: (state, action) => {
            const filteredDrivers = state.drivers.filter((driver) => {
                return driver?._id !== action.payload;
            });
            state.drivers = filteredDrivers;
        },
        updateDriver: (state, action) => {
            const objIndex = state.drivers?.findIndex((driver) => {
                return driver?._id === action.payload?._id;
            });
            state.drivers[objIndex] = action.payload;
        },
        addCurrency: (state, action) => {
            state.currencies?.unshift(action.payload);
        },
        deleteCurrency: (state, action) => {
            const filteredCurrencies = state.currencies.filter((currency) => {
                return currency?._id !== action.payload;
            });
            state.currencies = filteredCurrencies;
        },
        updateCurrency: (state, action) => {
            const objIndex = state.currencies?.findIndex((currency) => {
                return currency?._id === action.payload?._id;
            });
            state.currencies[objIndex] = action.payload;
        },
        changeCurrency: (state, action) => {
            state.selectedCurrency = {
                isocode: action.payload?.isocode,
                conversionRate: action.payload?.conversionRate,
                flag: action.payload?.country?.flag,
            };
            localStorage.setItem(
                "currency",
                JSON.stringify(state.selectedCurrency)
            );
        },
        addState: (state, action) => {
            state.states?.unshift(action.payload);
        },
        deleteState: (state, action) => {
            const filteredState = state.states.filter((st) => {
                return st?._id !== action.payload;
            });
            state.states = filteredState;
        },
        updateState: (state, action) => {
            const objIndex = state.states?.findIndex((st) => {
                return st?._id === action.payload?._id;
            });
            state.states[objIndex] = action.payload;
        },
        addCity: (state, action) => {
            state.cities?.unshift(action.payload);
        },
        deleteCity: (state, action) => {
            const filteredCity = state.cities.filter((city) => {
                return city?._id !== action.payload;
            });
            state.cities = filteredCity;
        },
        updateCity: (state, action) => {
            const objIndex = state.cities?.findIndex((city) => {
                return city?._id === action.payload?._id;
            });
            state.cities[objIndex] = action.payload;
        },
        addArea: (state, action) => {
            state.areas?.unshift(action.payload);
        },
        deleteArea: (state, action) => {
            const filteredArea = state.areas.filter((area) => {
                return area?._id !== action.payload;
            });
            state.areas = filteredArea;
        },
        updateArea: (state, action) => {
            const objIndex = state.areas?.findIndex((area) => {
                return area?._id === action.payload?._id;
            });
            state.areas[objIndex] = action.payload;
        },
    },
    extraReducers: {
        [fetchGeneralData1.fulfilled]: (state, action) => {
            state.countries = action.payload?.countries;
            state.destinations = action.payload?.destinations;
            state.drivers = action.payload?.drivers;
            state.currencies = action.payload?.currencies;

            const localCurrency = localStorage.getItem("currency")
                ? JSON.parse(localStorage.getItem("currency"))
                : "";
            if (localCurrency) {
                const objIndex = state.currencies?.findIndex((currency) => {
                    return (
                        currency?.isocode?.toUpperCase() ===
                        localCurrency?.isocode?.toUpperCase()
                    );
                });
                if (objIndex !== -1) {
                    state.selectedCurrency = {
                        isocode: state.currencies[objIndex]?.isocode,
                        conversionRate:
                            state.currencies[objIndex]?.conversionRate,
                        flag: state.currencies[objIndex]?.country?.flag,
                    };
                } else {
                    state.selectedCurrency = {
                        isocode: "AED",
                        conversionRate: 1,
                        flag: UAE_FLAG,
                    };
                }
            } else {
                state.selectedCurrency = {
                    isocode: "AED",
                    conversionRate: 1,
                    flag: UAE_FLAG,
                };
            }

            localStorage.setItem(
                "currency",
                JSON.stringify(state.selectedCurrency)
            );
            state.isGeneralLoading = false;
        },
        [fetchGeneralData2.fulfilled]: (state, action) => {
            state.states = action.payload?.states;
            state.cities = action.payload?.cities;
            state.areas = action.payload?.areas;
        },
        [fetchOrderData.fulfilled]: (state, action) => {
            state.b2bOrderCount = action.payload?.b2bOrderCount;
            state.b2cOrderCount = action.payload?.b2cOrderCount;
            state.b2bCancellationOrderCount =
                action.payload?.b2bCancellationOrderCount;
        },
    },
});

export const {
    addDestination,
    addCountry,
    deleteCountry,
    deleteDestination,
    updateCountry,
    updateDestination,
    addDriver,
    deleteDriver,
    updateDriver,
    addCurrency,
    deleteCurrency,
    updateCurrency,
    changeCurrency,
    addCity,
    addState,
    deleteCity,
    deleteState,
    updateCity,
    updateState,
    addArea,
    deleteArea,
    updateArea,
} = generalSlice.actions;

export default generalSlice.reducer;
