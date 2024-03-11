import {Pressable, Text} from "react-native";
import styles from './styles'

export default Item = ({itemId, itemText, onPress, onLongPress}) => {

    return (
        <Pressable onPress={onPress} onLongPress={onLongPress}
                   style={({pressed}) => [
                       styles.itemStyle,
                       {
                           backgroundColor: pressed ? 'rgb(0,221,255)' : 'white',
                       },
                   ]}
                   key={itemId}>
            <Text style={[styles.itemText,]}>{itemText}</Text>
        </Pressable>
    )
}