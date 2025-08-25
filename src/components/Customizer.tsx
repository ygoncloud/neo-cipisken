import React from 'react';

interface CustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
  borderRadius: number;
  boxShadowHorizontal: number;
  boxShadowVertical: number;
  headingFontWeight: number;
  baseFontWeight: number;
  onStyleChange: (styleName: string, value: any) => void;
}

const neobrutalismColors = [
  { name: 'Red', hex: 'oklch(67.28% 0.2147 24.22)' },
  { name: 'Orange', hex: 'oklch(72.27% 0.1894 50.19)' },
  { name: 'Amber', hex: 'oklch(84.08% 0.1725 84.2)' },
  { name: 'Yellow', hex: 'oklch(86.03% 0.176 92.36)' },
  { name: 'Lime', hex: 'oklch(83.29% 0.2331 132.51)' },
  { name: 'Green', hex: 'oklch(79.76% 0.2044 153.08)' },
  { name: 'Emerald', hex: 'oklch(77.54% 0.1681 162.78)' },
  { name: 'Teal', hex: 'oklch(78.57% 0.1422 180.36)' },
  { name: 'Cyan', hex: 'oklch(76.89% 0.139164 219.13)' },
  { name: 'Sky', hex: 'oklch(66.9% 0.18368 248.8066)' },
  { name: 'Blue', hex: 'oklch(67.47% 0.1726 259.49)' },
  { name: 'Indigo', hex: 'oklch(66.34% 0.1806 277.2)' },
  { name: 'Violet', hex: 'oklch(70.28% 0.1753 295.36)' },
  { name: 'Purple', hex: 'oklch(71.9% 0.198 310.03)' },
  { name: 'Fuchsia', hex: 'oklch(73.43% 0.2332 321.41)' },
  { name: 'Pink', hex: 'oklch(71.5% 0.197 354.23)' },
  { name: 'Rose', hex: 'oklch(70.79% 0.1862 16.25)' },
];

const getBackgroundColorForPrimary = (primaryColor: string): string => {
  return primaryColor; // Simply return the primary color
};

const Customizer: React.FC<CustomizerProps> = ({ 
  isOpen, 
  onClose, 
  primaryColor,
  borderRadius,
  boxShadowHorizontal,
  boxShadowVertical,
  headingFontWeight,
  baseFontWeight,
  onStyleChange 
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="customizer-panel">
      <div className="customizer-header">
        <h2>Customize Theme</h2>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="customizer-content">
        <div className="control-group">
          <label>Primary Color <span className="color-preview-circle" style={{ backgroundColor: primaryColor }}></span></label>
          <select
            value={primaryColor}
            onChange={(e) => {
              const newPrimaryColor = e.target.value;
              onStyleChange('primaryColor', newPrimaryColor);
              onStyleChange('backgroundColor', getBackgroundColorForPrimary(newPrimaryColor));
            }}
            className="color-dropdown"
          >
            {neobrutalismColors.map((color) => (
              <option key={color.name} value={color.hex}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>Border Radius: {borderRadius}px</label>
          <input 
            type="range" 
            min="0" 
            max="20" 
            value={borderRadius}
            onChange={(e) => onStyleChange('borderRadius', parseInt(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Horizontal Box Shadow: {boxShadowHorizontal}px</label>
          <input 
            type="range" 
            min="-20" 
            max="20" 
            value={boxShadowHorizontal}
            onChange={(e) => onStyleChange('boxShadowHorizontal', parseInt(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Vertical Box Shadow: {boxShadowVertical}px</label>
          <input 
            type="range" 
            min="-20" 
            max="20" 
            value={boxShadowVertical}
            onChange={(e) => onStyleChange('boxShadowVertical', parseInt(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Heading Font Weight: {headingFontWeight}</label>
          <input 
            type="range" 
            min="300" 
            max="900" 
            step="100"
            value={headingFontWeight}
            onChange={(e) => onStyleChange('headingFontWeight', parseInt(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Base Font Weight: {baseFontWeight}</label>
          <input 
            type="range" 
            min="300" 
            max="700" 
            step="100"
            value={baseFontWeight}
            onChange={(e) => onStyleChange('baseFontWeight', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Customizer);