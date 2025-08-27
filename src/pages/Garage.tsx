import GarageNavbar from "@components/garage/GarageNavbar";


export default function Garage() {

    return (
        <section className="garage-page">
            <GarageNavbar
                onStartAll={() => console.log("Start all")}
                onResetAll={() => console.log("Reset all")}
                onGenerate100={() => console.log("Generate 100")}
                onCreate={(name, color) => console.log("Create", name, color)}
                selected={null}
                onUpdateSelected={(name, color) => console.log("Update", name, color)}
            />
        </section>
    );
}