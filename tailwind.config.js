module.exports = {
	theme: {
		extend: {
			colors: {
				'regal-blue': '#243c5a',
				'blue': '#2196f3',
				'blue-50': '#e3f2fd',
				'blue-100': '#bbdefb',
				'blue-200': '#90caf9',
				'blue-300': '#64b5f6',
				'blue-400': '#42a5f5',
				'blue-500': '#2196f3',
				'blue-600': '#1e88e5',
				'blue-700': '#1976d2',
				'blue-800': '#1565c0',
				'blue-900': '#0d47a1',
				'blue-100-accent': '#82b1ff',
				'blue-200-accent': '#448aff',
				'blue-400-accent': '#2979ff',
				'blue-700-accent': '#2962ff',
				'blue-700-accent': '#2962ff',
			},
			fontSize: {
				xxs: '.5rem'
			}
		}
	},
	variants: {
		textColor: [ 'responsive', 'focus', 'hover', 'group-hover' ],
		visibility: [ 'responsive', 'focus', 'hover', 'group-hover' ],
		backgroundColor: [ 'responsive', 'focus', 'hover', 'group-hover' ]
	},
	plugins: []
};
