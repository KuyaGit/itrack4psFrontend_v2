import { Injectable } from '@angular/core';
import { barangayNames } from './data';
@Injectable({
  providedIn: 'root'
})
export class BarangaysService {
  private barangaylist : barangayNames [] = [
    {"barangay": "Alagao"},
    {"barangay": "Aplaya"},
    {"barangay": "As-is"},
    {"barangay": "Bagong Silang"},
    {"barangay": "Baguilawa"},
    {"barangay": "Balayong"},
    {"barangay": "Barangay I"},
    {"barangay": "Barangay II"},
    {"barangay": "Barangay III"},
    {"barangay": "Barangay IV"},
    {"barangay": "Bolo"},
    {"barangay": "Colvo"},
    {"barangay": "Cupang"},
    {"barangay": "Durungao"},
    {"barangay": "Gulibay"},
    {"barangay": "Inicbulan"},
    {"barangay": "Locloc"},
    {"barangay": "Magalang-Galang"},
    {"barangay": "Malindig"},
    {"barangay": "Manalupong"},
    {"barangay": "Manghinao Proper"},
    {"barangay": "Manghinao Uno"},
    {"barangay": "New Danglayan"},
    {"barangay": "Orense"},
    {"barangay": "Pitugo"},
    {"barangay": "Rizal"},
    {"barangay": "Sampaguita"},
    {"barangay": "San Agustin"},
    {"barangay": "San Andres Proper"},
    {"barangay": "San Andres Uno"},
    {"barangay": "San Diego"},
    {"barangay": "San Miguel"},
    {"barangay": "San Pablo"},
    {"barangay": "San Pedro"},
    {"barangay": "San Roque"},
    {"barangay": "San Teodoro"},
    {"barangay": "San Vicente"},
    {"barangay": "Santa Maria"},
    {"barangay": "Santo Domingo"},
    {"barangay": "Sinala"}
]
;

  getAllBarangayNames(){
    return this.barangaylist;
  }
  constructor() { }
}
