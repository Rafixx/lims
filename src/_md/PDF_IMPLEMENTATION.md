# PDF Implementation for Dynamic Templates

## Overview

This document describes the PDF rendering implementation for the dynamic template system, which mirrors the on-screen display in the PDF output.

## Files Created

### 1. DynamicTemplatePDF.tsx
**Location:** `src/features/plantillaTecnica/components/PDF/DynamicTemplatePDF.tsx`

Main container component that:
- Receives template, values, and calculatedValues
- Splits nodes into 2 columns (left and right)
- Renders a section title
- Uses a 2-column grid layout matching the screen version

### 2. TemplateNodePDF.tsx
**Location:** `src/features/plantillaTecnica/components/PDF/TemplateNodePDF.tsx`

Recursive router component that:
- Routes to appropriate renderer based on node type
- Handles: procedure, input, calc, group
- Passes values and calculatedValues down the tree

### 3. ProcedureNodePDF.tsx
**Location:** `src/features/plantillaTecnica/components/PDF/ProcedureNodePDF.tsx`

Renders procedure nodes:
- Blue card with "Procedimiento" label
- Numbered list of steps
- Uses primary color scheme

### 4. InputNodePDF.tsx
**Location:** `src/features/plantillaTecnica/components/PDF/InputNodePDF.tsx`

Renders input fields:
- Shows label and current value
- Displays unit if present
- Shows "—" for empty values
- Uses green color scheme

### 5. CalcNodePDF.tsx
**Location:** `src/features/plantillaTecnica/components/PDF/CalcNodePDF.tsx`

Renders calculated fields:
- Purple card with calculated value
- Shows the expression used
- Displays unit if present
- Shows "—" for undefined results

### 6. GroupNodePDF.tsx
**Location:** `src/features/plantillaTecnica/components/PDF/GroupNodePDF.tsx`

Renders group nodes:
- Gray header with left border
- Recursively renders children
- Indented content

## Files Modified

### 1. PlantillaTecnicaPDF.tsx
**Changes:**
- Added Template and TemplateValues imports
- Added optional props: template, templateValues, calculatedValues
- Added conditional rendering of DynamicTemplatePDF before TecnicasListPDF
- Maintains existing structure for pipetas, reactivos, and pasos

### 2. downloadPDF.tsx
**Changes:**
- Added Template and TemplateValues imports
- Extended DownloadPDFParams interface with optional template data
- Passes template data through to PlantillaTecnicaPDF

### 3. PlantillaTecnicaHeader.tsx
**Changes:**
- Added Template and TemplateValues imports
- Extended props with template, templateValues, calculatedValues
- Passes template data to downloadPlantillaTecnicaPDF in handleDownload

### 4. PlantillaTecnicaPage.tsx
**Changes:**
- Added useMemo and calculation logic imports
- Created calculatedValuesForPDF using multi-pass algorithm
- Passes template, savedValues, and calculatedValuesForPDF to header
- Calculation logic extracts calc nodes recursively and evaluates them

## Data Flow

```
PlantillaTecnicaPage
  ├── Loads: template (from dim_tecnicas_proc.json_data)
  ├── Loads: savedValues (from worklist.json_data.template_values)
  ├── Calculates: calculatedValuesForPDF (using multi-pass algorithm)
  └── Passes to: PlantillaTecnicaHeader
        └── On PDF download: downloadPlantillaTecnicaPDF
              └── PlantillaTecnicaPDF
                    └── DynamicTemplatePDF (if template exists)
                          └── TemplateNodePDF (recursive)
                                ├── ProcedureNodePDF
                                ├── InputNodePDF
                                ├── CalcNodePDF
                                └── GroupNodePDF
```

## Layout Structure

### Screen Layout (DynamicTemplateRenderer)
```tsx
<div className="grid grid-cols-2 gap-6">
  {template.nodes.map(node => (
    <TemplateNodeRenderer ... />
  ))}
</div>
```

### PDF Layout (DynamicTemplatePDF)
```tsx
<View style={grid2Cols}>
  <View style={gridColumnLeft}>
    {leftNodes.map(node => <TemplateNodePDF ... />)}
  </View>
  <View style={gridColumnRight}>
    {rightNodes.map(node => <TemplateNodePDF ... />)}
  </View>
</View>
```

## Styling

All PDF components use the shared color scheme from `styles.ts`:
- **Primary** (blue): Procedure nodes
- **Success** (green): Input nodes
- **Purple**: Calculated nodes
- **Surface** (gray): Groups, borders, text

## Calculation Logic

The PDF uses the same multi-pass calculation algorithm as the screen version:

1. Extract all calc nodes from the template tree (including nested groups)
2. Run up to 3 passes
3. Each pass:
   - Merge input values with already calculated values
   - Try to evaluate each unresolved calc
   - Mark pass as having changes if any calc resolves
4. Return all calculated values

This ensures dependencies between calculated fields are resolved correctly.

## Usage Example

When the user clicks "Descargar PDF" in PlantillaTecnicaHeader:

1. The button triggers `handleDownload()`
2. Template data is passed to `downloadPlantillaTecnicaPDF()`
3. PDF is generated with `PlantillaTecnicaPDF` component
4. If template exists, `DynamicTemplatePDF` is rendered
5. Template nodes are split into 2 columns
6. Each node is rendered with its appropriate component
7. PDF blob is created and downloaded

## Edge Cases Handled

- **No template:** PDF skips dynamic template section
- **Empty values:** Shows "—" in PDF
- **Undefined calculations:** Shows "—" in PDF
- **No unit:** Unit is not displayed
- **Nested groups:** Recursively handled by GroupNodePDF
- **Dependencies:** Resolved with multi-pass algorithm

## Testing

To test the PDF implementation:

1. Navigate to a worklist with a valid template
2. Fill in some input values
3. Save the template values
4. Click "Descargar PDF"
5. Verify the PDF includes:
   - Template section at the top
   - 2-column layout
   - All node types rendered correctly
   - Values matching the screen display
   - Calculated values showing expressions

## Future Enhancements

Potential improvements:
- Add page breaks for long templates
- Include validation errors in PDF
- Add timestamp to template values
- Show "unsaved changes" indicator
- Export multiple worklists at once
