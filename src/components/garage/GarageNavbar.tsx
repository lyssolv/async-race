import { useEffect, useState } from "react";
import Button from "@shared/components/button";
import ColorPicker from "@shared/components/ColorPicker";
import "./GarageNavbar.css"

export type Car = { id: number; name: string; color: string };

type Props = {
    onStartAll: () => void;
    onResetAll: () => void;
    onGenerate100: () => void;
    
    onCreate: (name: string, color: string) => void;
    selected: Car | null;
    onUpdateSelected: (name: string, color: string) => void;
    startDisabled?: boolean;
    resetDisabled?: boolean;
};

export default function GarageNavbar({
     onStartAll,
     onResetAll,
     onGenerate100,
     onCreate,
     selected,
     onUpdateSelected,
     startDisabled = false,
     resetDisabled = false,   
}: Props) {
    const [createName, setCreateName] = useState("");
    const [createColor, setCreateColor] = useState("#30C0B7");

    const [updateName, setUpdateName] = useState("");
    const [updateColor, setUpdateColor] = useState("#30C0B7");

    useEffect(() => {
        if (selected) {
            setUpdateName(selected.name);
            setUpdateColor(selected.color);
        } else {
            setUpdateName("");
            setUpdateColor("#30C0B7");
        }
    }, [selected]);

    const validCreate = createName.trim().length > 0 && createName.trim().length <= 32;
    const validUpdate = updateName.trim().length > 0 && updateName.trim().length <= 32;

    const handleCreate = () => {
        if (!validCreate) return;
        onCreate(createName.trim(), createColor);
        setCreateName("");
        setCreateColor("#30C0B7");
    };

    const handleUpdate = () => {
        if (!selected || !validUpdate) return;
        onUpdateSelected(updateName.trim(), updateColor);
    };

    return (
        <div className="garage-navbar" role="toolbar" aria-label="Garage controls">
            {/* Race controls */}
            <div className="nav-group">
                <Button color="green" onClick={onStartAll} disabled={startDisabled} aria-label="Start race for all cars">
                    RACE
                </Button>
                <Button onClick={onResetAll} disabled={resetDisabled} aria-label="Reset race for all cars">
                    RESET
                </Button>
            </div>
            {/* Create block */}
            <div className="nav-group create">
                <label className="field">
                    <input
                        type="text"
                        value={createName}
                        onChange={(e) => setCreateName(e.target.value)}
                        placeholder="TYPE CAR BRAND"
                        maxLength={32}
                    />
                </label>

                <label className="field">
                    <ColorPicker value={createColor} onChange={setCreateColor} />
                </label>
                <Button onClick={handleCreate} disabled={!validCreate} aria-label="Create car">
                    CREATE
                </Button>
            </div>

            {/* Update block */}
            <div className="nav-group update">
                <label className="field">
                    <input
                        type="text"
                        value={updateName}
                        onChange={(e) => setUpdateName(e.target.value)}
                        placeholder="TYPE CAR BRAND"
                        maxLength={32}
                        disabled={!selected}
                    />
                </label>
                <label className="field">
                    <ColorPicker value={updateColor} onChange={setUpdateColor} disabled={!selected} />
                </label>
                <Button
                    onClick={handleUpdate}
                    disabled={!selected || !validUpdate}
                    aria-label="Update selected car"
                >
                    UPDATE
                </Button>
            </div>
            {/* Generate Cars*/}
            <div className="nav-group">
                <Button
                    color="green"
                    onClick={onGenerate100}
                    aria-label="Generate one hundred random cars"
                >
                    GENERATE CARS
                </Button>
            </div>
        </div>
    );
}