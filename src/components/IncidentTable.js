import { useState, useRef, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Paper,
	Typography,
	Box,
	Button,
	IconButton,
	Checkbox,
	Menu,
	MenuItem,
	InputAdornment,
} from '@mui/material';
import { parseISO, format } from 'date-fns';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import dayjs from 'dayjs';

// Utility function to format incident creation date
const formatDate = (created_at) => {
	let formattedDate;
	try {
		// Parse date if available
		const parsedDate = created_at ? parseISO(created_at) : null;
		if (!isNaN(parsedDate)) {
			// Format parsed date as "MMM d, yyyy at h:mm a"
			formattedDate = format(parsedDate, "MMM d, yyyy 'at' h:mm a");
		} else {
			// Fallback to local date format if parsing fails
			const fallbackDate = new Date(created_at);
			formattedDate = !isNaN(fallbackDate)
				? `on ${fallbackDate.toLocaleString('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
				  })} at ${fallbackDate.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
				: 'N/A';
		}
	} catch (error) {
		console.error('Date parsing error:', error);
		formattedDate = 'N/A';
	}
	return formattedDate;
};

const IncidentTable = ({ incidents }) => {
	// State to manage filters for incidents table
	const initialFilters = {
		status: [],
		priority: [],
		urgency: [],
		title: '',
		created: null,
	};

	const [filters, setFilters] = useState(initialFilters);

	const [sortOrder, setSortOrder] = useState('asc');
	const [anchorEl, setAnchorEl] = useState({});
	const [titleFilterVisible, setTitleFilterVisible] = useState(false);
	const titleFilterRef = useRef(null);

	// Function to clear all filters
	const clearAllFilters = () => {
		setFilters(initialFilters);
	};

	// Handle changes in filters for different fields
	const handleFilterChange = (field, value) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[field]: value,
		}));
	};

	// Handle changes in checkbox filters (for multi-select fields like status,priority and urgency)
	const handleCheckboxChange = (field, value) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[field]: prevFilters[field].includes(value)
				? prevFilters[field].filter((item) => item !== value)
				: [...prevFilters[field], value],
		}));
		setAnchorEl({}); // Close the menu after selection
	};

	// Toggle sorting order for date sorting
	const toggleSortOrder = () => {
		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
	};

	// Set filter for date range
	const handleDateRangeFilter = (days) => {
		const targetDate = dayjs().subtract(days, 'day');
		setFilters((prevFilters) => ({
			...prevFilters,
			created: targetDate,
		}));
		setAnchorEl({}); // Close the menu after selection
	};

	// Open filter menu for the specified field
	const openFilterMenu = (event, field) => {
		setAnchorEl({ ...anchorEl, [field]: event.currentTarget });
	};

	// Close the filter menu for the specified field
	const closeFilterMenu = (field) => {
		setAnchorEl({ ...anchorEl, [field]: null });
	};

	// Toggle title filter visibility and reset if hidden
	const toggleTitleFilterVisibility = () => {
		setTitleFilterVisible((prevVisible) => !prevVisible);
		if (!titleFilterVisible) {
			setFilters((prevFilters) => ({ ...prevFilters, title: '' }));
		}
	};

	// Clear title filter input and hide filter
	const handleClearTitleFilter = () => {
		setFilters((prevFilters) => ({ ...prevFilters, title: '' }));
		setTitleFilterVisible(false);
	};

	// Handle Enter key press to apply title filter
	const handleTitleFilterKeyDown = (e) => {
		if (e.key === 'Enter') {
			setTitleFilterVisible(false);
		}
	};

	// Close title filter when clicking outside the filter input
	const handleClickOutside = (event) => {
		if (titleFilterRef.current && !titleFilterRef.current.contains(event.target)) {
			setTitleFilterVisible(false);
		}
	};

	// Effect to add/remove event listener for detecting clicks outside title filter
	useEffect(() => {
		if (titleFilterVisible) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [titleFilterVisible]);

	// Filter and sort incidents based on selected filters and sort order
	const filteredIncidents = incidents
		.filter((incident) => {
			return Object.keys(filters).every((key) => {
				if (key === 'status' && filters.status.length > 0) {
					return filters.status.includes(incident.status);
				}
				if (key === 'priority' && filters.priority.length > 0) {
					return filters.priority.includes(incident.priority.summary);
				}
				if (key === 'urgency' && filters.urgency.length > 0) {
					return filters.urgency.includes(incident.urgency);
				}
				if (key === 'created' && filters.created) {
					return dayjs(incident.created_at).isAfter(filters.created);
				}
				if (key === 'title' && filters.title) {
					return incident.title.toLowerCase().includes(filters.title.toLowerCase());
				}
				return true;
			});
		})
		.sort((a, b) => {
			const dateA = dayjs(a.created_at);
			const dateB = dayjs(b.created_at);
			return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
		});

	return (
		<Box>
			<Box display="flex" justifyContent="flex-end" mb={2}>
				<Button variant="contained" onClick={clearAllFilters}>
					Clear All Filters
				</Button>
			</Box>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{['status', 'priority', 'urgency', 'title', 'created'].map((column) => (
								<TableCell
									key={column}
									sx={{
										backgroundColor: '#424242',
										color: '#fff', // White text for contrast
										fontSize: '1rem',
									}}
								>
									<Box display="flex" alignItems="center">
										<Typography sx={{ color: '#fff' }}>
											{column.charAt(0).toUpperCase() + column.slice(1)}
										</Typography>
										{column !== 'title' && (
											<IconButton onClick={(event) => openFilterMenu(event, column)} size="small">
												<FilterAltIcon fontSize="small" sx={{ color: '#fff' }} />
											</IconButton>
										)}
										{column === 'title' && (
											<>
												<IconButton onClick={toggleTitleFilterVisibility} size="small">
													<FilterAltIcon fontSize="small" sx={{ color: '#fff' }} />
												</IconButton>
												{titleFilterVisible && (
													<TextField
														variant="outlined"
														size="small"
														fullWidth
														placeholder={`Filter ${column}`}
														value={filters.title}
														onChange={(e) => handleFilterChange(column, e.target.value)}
														onKeyDown={handleTitleFilterKeyDown}
														inputRef={titleFilterRef}
														sx={{
															backgroundColor: '#fff', // White background for the TextField
															mt: 1,
														}}
														InputProps={{
															endAdornment: (
																<InputAdornment position="end">
																	<IconButton
																		onClick={handleClearTitleFilter}
																		size="small"
																	>
																		<ClearIcon fontSize="small" />
																	</IconButton>
																</InputAdornment>
															),
														}}
													/>
												)}
											</>
										)}
										{column === 'created' && (
											<IconButton onClick={toggleSortOrder} size="small" sx={{ color: '#fff' }}>
												{sortOrder === 'asc' ? (
													<SwapVertIcon fontSize="small" />
												) : (
													<SwapVertIcon fontSize="small" />
												)}
											</IconButton>
										)}
									</Box>
									<Menu
										anchorEl={anchorEl[column]}
										open={Boolean(anchorEl[column])}
										onClose={() => closeFilterMenu(column)}
									>
										{column === 'status' &&
											['Acknowledged', 'Triggered', 'Resolved'].map((status) => (
												<MenuItem
													key={status}
													onClick={() => handleCheckboxChange('status', status)}
												>
													<Checkbox checked={filters.status.includes(status)} />
													{status}
												</MenuItem>
											))}
										{column === 'priority' &&
											['P1', 'P2', 'P3'].map((priority) => (
												<MenuItem
													key={priority}
													onClick={() => handleCheckboxChange('priority', priority)}
												>
													<Checkbox checked={filters.priority.includes(priority)} />
													{priority}
												</MenuItem>
											))}
										{column === 'urgency' &&
											['high', 'low'].map((urgency) => (
												<MenuItem
													key={urgency}
													onClick={() => handleCheckboxChange('urgency', urgency)}
												>
													<Checkbox checked={filters.urgency.includes(urgency)} />
													{urgency.charAt(0).toUpperCase() + urgency.slice(1)}
												</MenuItem>
											))}
										{column === 'created' &&
											[5, 10, 30].map((days) => (
												<MenuItem key={days} onClick={() => handleDateRangeFilter(days)}>
													Last {days} days
												</MenuItem>
											))}
									</Menu>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredIncidents.length > 0 ? (
							filteredIncidents.map((incident, index) => (
								<TableRow key={index}>
									<TableCell
										sx={{
											color:
												incident.status === 'Resolved'
													? 'green'
													: ['Acknowledged', 'Triggered'].includes(incident.status)
													? 'red'
													: 'inherit',
											fontSize: '1rem',
										}}
									>
										{incident.status}
									</TableCell>
									<TableCell sx={{ fontSize: '1rem' }}>{incident.priority.summary}</TableCell>
									<TableCell sx={{ fontSize: '1rem' }}>{incident.urgency}</TableCell>
									<TableCell sx={{ fontSize: '1rem' }}>
										<Typography variant="body2" color="primary">
											{incident.title}
										</Typography>
									</TableCell>
									<TableCell sx={{ fontSize: '1rem' }}>{formatDate(incident.created_at)}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} align="center">
									<Typography variant="body2" color="textSecondary">
										No Data Found
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default IncidentTable;
