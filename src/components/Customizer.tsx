
import React from 'react';

interface CustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  styles: {
    primaryColor: string;
    borderRadius: number;
    boxShadowHorizontal: number;
    boxShadowVertical: number;
    headingFontWeight: number;
    baseFontWeight: number;
  };
  onStyleChange: (styleName: string, value: any) => void;
}

const neobrutalismColors = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Lime', hex: '#84CC16' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Sky', hex: '#0EA5E9' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Fuchsia', hex: '#D946EF' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
];

const Customizer: React.FC<CustomizerProps> = ({ isOpen, onClose, styles, onStyleChange }) => {
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
          <label>Primary Color <span className="color-preview-circle" style={{ backgroundColor: styles.primaryColor }}></span></label>
          <select
            value={styles.primaryColor}
            onChange={(e) => onStyleChange('primaryColor', e.target.value)}
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
          <label>Border Radius: {styles.borderRadius}px</label>
          <input 
            type="range" 
            min="0" 
            max="20" 
            value={styles.borderRadius}
            onChange={(e) => onStyleChange('borderRadius', parseInt(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Horizontal Box Shadow: {styles.boxShadowHorizontal}px</label>
          <input 
            type="range" 
            min="-20" 
            max="20" 
            value={styles.boxShadowHorizontal}
            onChange={(e) => onStyleChange('boxShadowHorizontal', parseInt(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Vertical Box Shadow: {styles.boxShadowVertical}px</label>
          <input 
            type="range" 
            min="-20" 
            max="20" 
            value={styles.boxShadowVertical}
            onChange={(e) => onStyleChange('boxShadowVertical', parseInt(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Heading Font Weight: {styles.headingFontWeight}</label>
          <input 
            type="range" 
            min="300" 
            max="900" 
            step="100"
            value={styles.headingFontWeight}
            onChange={(e) => onStyleChange('headingFontWeight', parseInt(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label>Base Font Weight: {styles.baseFontWeight}</label>
          <input 
            type="range" 
            min="300" 
            max="700" 
            step="100"
            value={styles.baseFontWeight}
            onChange={(e) => onStyleChange('baseFontWeight', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Customizer;
