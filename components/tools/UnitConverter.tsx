"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Unit {
  label: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const UNIT_SETS: Record<string, Unit[]> = {
  length: [
    { label: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Mile (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { label: "Yard (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { label: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { label: "Nautical Mile (nmi)", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ],
  weight: [
    { label: "Metric Ton (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Kilogram (kg)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Gram (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Milligram (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { label: "Pound (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { label: "Ounce (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { label: "Stone (st)", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
    { label: "US Ton (short ton)", toBase: (v) => v * 907.185, fromBase: (v) => v / 907.185 },
  ],
  "data-storage": [
    { label: "Byte (B)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilobyte (KB)", toBase: (v) => v * 1e3, fromBase: (v) => v / 1e3 },
    { label: "Megabyte (MB)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { label: "Gigabyte (GB)", toBase: (v) => v * 1e9, fromBase: (v) => v / 1e9 },
    { label: "Terabyte (TB)", toBase: (v) => v * 1e12, fromBase: (v) => v / 1e12 },
    { label: "Petabyte (PB)", toBase: (v) => v * 1e15, fromBase: (v) => v / 1e15 },
    { label: "Kibibyte (KiB)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    { label: "Mebibyte (MiB)", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
    { label: "Gibibyte (GiB)", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
    { label: "Tebibyte (TiB)", toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
  ],
  speed: [
    { label: "Meter/second (m/s)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilometer/hour (km/h)", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { label: "Mile/hour (mph)", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { label: "Knot (kn)", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    { label: "Foot/second (ft/s)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "Mach (at sea level)", toBase: (v) => v * 340.29, fromBase: (v) => v / 340.29 },
  ],
  area: [
    { label: "Square Meter (m²)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Square Kilometer (km²)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { label: "Square Mile (mi²)", toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },
    { label: "Square Yard (yd²)", toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
    { label: "Square Foot (ft²)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { label: "Square Inch (in²)", toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
    { label: "Acre", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { label: "Hectare (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  ],
  volume: [
    { label: "Liter (L)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Milliliter (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Cubic Meter (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Cubic Centimeter (cm³)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "US Gallon (gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { label: "US Quart (qt)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { label: "US Pint (pt)", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { label: "US Cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { label: "US Fluid Ounce (fl oz)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    { label: "Imperial Gallon", toBase: (v) => v * 4.54609, fromBase: (v) => v / 4.54609 },
  ],
  angle: [
    { label: "Degree (°)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Radian (rad)", toBase: (v) => v * (180 / Math.PI), fromBase: (v) => v * (Math.PI / 180) },
    { label: "Gradian (gon)", toBase: (v) => v * 0.9, fromBase: (v) => v / 0.9 },
    { label: "Milliradian (mrad)", toBase: (v) => v * (180 / (Math.PI * 1000)), fromBase: (v) => v / (180 / (Math.PI * 1000)) },
    { label: "Arcminute (′)", toBase: (v) => v / 60, fromBase: (v) => v * 60 },
    { label: "Arcsecond (″)", toBase: (v) => v / 3600, fromBase: (v) => v * 3600 },
  ],
  pressure: [
    { label: "Pascal (Pa)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilopascal (kPa)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Megapascal (MPa)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { label: "Bar", toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
    { label: "Millibar (mbar)", toBase: (v) => v * 100, fromBase: (v) => v / 100 },
    { label: "PSI (lb/in²)", toBase: (v) => v * 6894.76, fromBase: (v) => v / 6894.76 },
    { label: "Atmosphere (atm)", toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
    { label: "mmHg / Torr", toBase: (v) => v * 133.322, fromBase: (v) => v / 133.322 },
  ],
  energy: [
    { label: "Joule (J)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilojoule (kJ)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Calorie (cal)", toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
    { label: "Kilocalorie (kcal)", toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
    { label: "Watt-hour (Wh)", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { label: "Kilowatt-hour (kWh)", toBase: (v) => v * 3.6e6, fromBase: (v) => v / 3.6e6 },
    { label: "BTU", toBase: (v) => v * 1055.06, fromBase: (v) => v / 1055.06 },
    { label: "Electronvolt (eV)", toBase: (v) => v * 1.60218e-19, fromBase: (v) => v / 1.60218e-19 },
  ],
  power: [
    { label: "Watt (W)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilowatt (kW)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Megawatt (MW)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { label: "Horsepower (hp, mechanical)", toBase: (v) => v * 745.7, fromBase: (v) => v / 745.7 },
    { label: "Horsepower (PS, metric)", toBase: (v) => v * 735.499, fromBase: (v) => v / 735.499 },
    { label: "BTU/hour", toBase: (v) => v * 0.293071, fromBase: (v) => v / 0.293071 },
    { label: "Foot-pound/second (ft·lbf/s)", toBase: (v) => v * 1.35582, fromBase: (v) => v / 1.35582 },
  ],
};

interface UnitConverterProps {
  type: "length" | "weight" | "data-storage" | "speed" | "area" | "volume" | "angle" | "pressure" | "energy" | "power";
  precision?: number;
}

export default function UnitConverter({ type, precision = 6 }: UnitConverterProps) {
  const t = useTranslations("UnitConverter");
  const units = UNIT_SETS[type];
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (changedUnit: Unit, rawValue: string) => {
    const num = parseFloat(rawValue);
    if (rawValue === "" || rawValue === "-") {
      setValues({ [changedUnit.label]: rawValue });
      return;
    }
    if (isNaN(num)) {
      setValues((prev) => ({ ...prev, [changedUnit.label]: rawValue }));
      return;
    }
    const base = changedUnit.toBase(num);
    const newValues: Record<string, string> = {};
    units.forEach((u) => {
      if (u.label === changedUnit.label) {
        newValues[u.label] = rawValue;
      } else {
        const converted = u.fromBase(base);
        const fixed = parseFloat(converted.toPrecision(precision));
        newValues[u.label] = isFinite(fixed) ? String(fixed) : "";
      }
    });
    setValues(newValues);
  };

  const clear = () => setValues({});

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={clear}
          className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{unit.label}</label>
            <input
              type="number"
              value={values[unit.label] ?? ""}
              onChange={(e) => handleChange(unit, e.target.value)}
              placeholder="0"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
