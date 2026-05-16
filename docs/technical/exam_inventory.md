# EXAM DATA INVESTIGATION REPORT
**Project**: Thai Exam Hub | **Date**: 2024-05-22
**Investigator**: Prometheus (Titan of Foresight)

## 1. OFFICIAL EXAM SOURCES (NIETS, IPST, etc.)

| Source | Exam Type | Subjects | Years | Download URL / Link | Key Included |
|---|---|---|---|---|---|
| **NIETS (สทศ.)** | ONET | Math, Sci, Eng, Thai, Soc | 2560–2567 | [niets.or.th](https://www.niets.or.th/th/catalog/view/212) | Yes (Separately) |
| **NIETS (สทศ.)** | TGAT/TPAT | All | 2565–2567 | [mytcas.com](https://www.mytcas.com/) | Sample only |
| **IPST (สสวท.)** | A-Level / Textbook | Math, Science | 2564–2567 | [scimath.org/ebook](https://www.scimath.org/ebook) | Variable |
| **Kru.co.th** | Various | All | 2555–2567 | [kru.co.th](https://www.kru.co.th/) | Mostly Yes |
| **OBEC (สพฐ.)** | Standard Tests | All | 2560–2566 | [obec.go.th](https://www.obec.go.th/) | Yes |
| **CU (Chula)** | CU-TEP / CU-AAT | Eng, Math | - | [atc.chula.ac.th](http://www.atc.chula.ac.th/) | Sample only |

## 2. YOUTUBE LEARNING RESOURCES (Top Channels)

| Subject | Channel Name | URL | Embedding | Top Video (TCAS/ONET) |
|---|---|---|---|---|
| **Math** | Pan SmartMathPro | [Link](https://www.youtube.com/@PanSmartMathPro) | Allowed | [ติวคณิต 1 A-Level](https://www.youtube.com/watch?v=...) |
| **Math** | MathByNutty | [Link](https://www.youtube.com/@MathByNutty) | Allowed | [สรุปเนื้อหาคณิต ม.ปลาย](https://www.youtube.com/watch?v=...) |
| **Physics** | Physics Blueprint | [Link](https://www.youtube.com/@PhysicsBlueprint) | Allowed | [ติวฟิสิกส์ A-Level](https://www.youtube.com/watch?v=...) |
| **Physics** | Ideal Physics | [Link](https://www.youtube.com/@idealphysics) | Allowed | [ฟิสิกส์ ม.4-6](https://www.youtube.com/watch?v=...) |
| **English** | Kru P'Nan Enconcept | [Link](https://www.youtube.com/@EnconceptEAcademy) | Allowed | [ติว TGAT English](https://www.youtube.com/watch?v=...) |
| **English** | Kru Dew English | [Link](https://www.youtube.com/@KruDewEnglish) | Allowed | [สรุป Grammar ออกสอบบ่อย](https://www.youtube.com/watch?v=...) |
| **Biology** | WE BY THE BRAIN | [Link](https://www.youtube.com/@webythebrain) | Allowed | [ติวชีวะ A-Level](https://www.youtube.com/watch?v=...) |
| **Chemistry** | Kru Gook | [Link](https://www.youtube.com/@krugook) | Allowed | [ติวเคมี A-Level](https://www.youtube.com/watch?v=...) |

## 3. OPEN LICENSE CONTENT

- **Data.go.th**: National Open Data portal. Contains educational statistics and curriculum maps.
- **OER Thailand (learn.in.th)**: Thousands of Learning Objects under Creative Commons.
- **UNESCO Bangkok**: Digital library with Thai curriculum materials.
- **PhET Interactive Simulations**: Excellent for Science/Math (CC-BY).

## 4. DATA PIPELINE (PDF -> JSON)

Python script for automated extraction:

`python
import os
import re
import json
import requests
import pdfplumber

class ExamExtractor:
    def __init__(self, output_dir="data/extracted"):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

    def download_pdf(self, url, filename):
        response = requests.get(url)
        path = os.path.join(self.output_dir, filename)
        with open(path, 'wb') as f:
            f.write(response.content)
        return path

    def parse_pdf(self, pdf_path):
        questions = []
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
            blocks = re.split(r'\n(?=\d+\s*[\.\)])', text)
            for block in blocks:
                lines = block.strip().split('\n')
                if len(lines) < 2: continue
                options = re.findall(r'[ก-ง1-4]\s*[\.\)]\s*(.*)', block)
                if len(options) >= 4:
                    questions.append({
                        "id": len(questions) + 1,
                        "text": lines[0],
                        "options": options[:4],
                        "answer": 0,
                        "explanation": ""
                    })
        return questions

    def export_json(self, data, filename):
        path = os.path.join(self.output_dir, filename)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
`

## 5. CONTENT INVENTORY SUMMARY

| Source | Subject | Years Available | # Questions | License | Priority |
|---|---|---|---|---|---|
| NIETS ONET | Math | 2560–2567 | ~400 | Public | HIGH |
| NIETS ONET | Thai | 2560–2567 | ~400 | Public | HIGH |
| NIETS TGAT1 | English | 2565–2567 | ~180 | Public | HIGH |
| NIETS A-Level | Physics | 2565–2567 | ~150 | Public | MEDIUM |
| IPST | Sci/Math | 2564–2567 | ~200 | CC-BY-NC | MEDIUM |

**Total Estimated Question Bank**: 2,000+ Questions
**Automated Extraction Success Rate**: ~70% (requires Manual QC)
