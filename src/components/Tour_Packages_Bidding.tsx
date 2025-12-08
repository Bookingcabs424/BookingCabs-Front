import ActiveTourSlider from "./ActiveTourSlider";
import Bidding from "./Bidding";
import PackageSlider from "./PackageSlider";



export default function ToursPackagesBidding(){
    return(
        <div className="grid grid-cols-12 mb-6 gap-5">
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <ActiveTourSlider/>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Bidding/>
            </div>
            <div className="col-span-12 lg:col-span-4">
                <PackageSlider/>
            </div>
        </div>  
    )
}