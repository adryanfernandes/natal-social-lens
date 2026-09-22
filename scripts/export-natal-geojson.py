"""Exporta os bairros de Natal do GeoPackage oficial do Censo 2022."""

import json
import os
import sqlite3
import struct
import unicodedata
from pathlib import Path


SOURCE = Path(os.environ["TEMP"]) / "RN_bairros_CD2022.gpkg"
TARGET = Path(__file__).parents[1] / "public" / "data" / "natal-bairros.geojson"


def read_uint(data, offset, endian):
    return struct.unpack_from(endian + "I", data, offset)[0], offset + 4


def read_point(data, offset, endian, dimensions):
    values = struct.unpack_from(endian + "d" * dimensions, data, offset)
    return [values[0], values[1]], offset + dimensions * 8


def read_wkb(data, offset=0):
    endian = "<" if data[offset] == 1 else ">"
    raw_type, offset = read_uint(data, offset + 1, endian)
    geometry_type = raw_type & 0xFF
    dimensions = 2
    if raw_type >= 3000:
        geometry_type = raw_type - 3000
        dimensions = 4
    elif raw_type >= 2000:
        geometry_type = raw_type - 2000
        dimensions = 3
    elif raw_type >= 1000:
        geometry_type = raw_type - 1000
        dimensions = 3

    if geometry_type == 3:
        ring_count, offset = read_uint(data, offset, endian)
        rings = []
        for _ in range(ring_count):
            point_count, offset = read_uint(data, offset, endian)
            ring = []
            for _ in range(point_count):
                point, offset = read_point(data, offset, endian, dimensions)
                ring.append(point)
            rings.append(ring)
        return {"type": "Polygon", "coordinates": rings}, offset

    if geometry_type == 6:
        polygon_count, offset = read_uint(data, offset, endian)
        polygons = []
        for _ in range(polygon_count):
            polygon, offset = read_wkb(data, offset)
            polygons.append(polygon["coordinates"])
        return {"type": "MultiPolygon", "coordinates": polygons}, offset

    raise ValueError(f"Tipo WKB nao suportado: {raw_type}")


def gpkg_geometry(blob):
    flags = blob[3]
    envelope_type = (flags >> 1) & 0b111
    envelope_sizes = {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}
    offset = 8 + envelope_sizes[envelope_type]
    return read_wkb(blob, offset)[0]


def ascii_upper(value):
    normalized = unicodedata.normalize("NFD", value)
    return "".join(char for char in normalized if unicodedata.category(char) != "Mn").upper()


def main():
    connection = sqlite3.connect(SOURCE)
    rows = connection.execute(
        "SELECT CD_BAIRRO, NM_BAIRRO, geom FROM RN_bairros_CD2022 "
        "WHERE CD_MUN = ? ORDER BY NM_BAIRRO",
        ("2408102",),
    ).fetchall()
    features = [
        {
            "type": "Feature",
            "properties": {"codigo": code, "bairro": ascii_upper(name)},
            "geometry": gpkg_geometry(geometry),
        }
        for code, name, geometry in rows
    ]
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    TARGET.write_text(
        json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"{len(features)} bairros exportados para {TARGET}")


if __name__ == "__main__":
    main()
