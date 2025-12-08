import DestinationOfDaySlider from "./DestinationOfDaySlider";
import ThingsToDoSlider from "./ThingsToDoSlider";


export default function DestinationActivitiesSlider(){
    return(
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DestinationOfDaySlider/>
            <ThingsToDoSlider/>
        </div>
    )
}