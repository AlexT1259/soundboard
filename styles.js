import {StyleSheet} from "react-native";


let styles;
export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 20
    },
    itemStyle: {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'black',
        backgroundColor: 'white',
        width: '100%',
        margin: 2,
        paddingTop: 10,
        paddingBottom: 10,
    },
    itemText: {
        fontSize: 24,
    },
    listArea: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        width: '100%'
    },
    heading:{
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        margin: 2
    },
    flexRow: {
        flexDirection: "row",
    },
    input: {
        borderColor: "orange",
        borderRadius: 10,
        borderWidth: 5,
        margin: 16,
        padding: 8,
        fontSize: 20,
        color: "red",
    },
});
