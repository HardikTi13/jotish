import axios from 'axios'

const BASE_URL = 'https://backend.jotish.in/backend_dev'

export const fetchEmployees = async () => {
    const response = await axios.post(
        `${BASE_URL}/gettabledata.php`,
        { username: 'test', password: '123456' },
        {
            headers: { 'Content-Type': 'application/json' },
        }
    )
    const data = response.data

    // API returns: { TABLE_DATA: { data: [[name, role, city, id, date, salary], ...] } }
    const tableData = data?.TABLE_DATA?.data || data?.table_data?.data || data?.data

    if (Array.isArray(tableData) && tableData.length > 0) {
        // Each row is an array: [Name, Role/Designation, City, ID, Date, Salary]
        if (Array.isArray(tableData[0])) {
            return tableData.map(row => ({
                name: String(row[0] || '—'),
                designation: String(row[1] || 'Staff'),
                city: String(row[2] || 'Unknown'),
                id: String(row[3] || '0'),
                date: String(row[4] || '—'),
                salary: parseFloat(String(row[5] || '0').replace(/[$,]/g, '')) || 0,
            }))
        }

        // Already an array of objects
        if (typeof tableData[0] === 'object' && !Array.isArray(tableData[0])) {
            return tableData
        }
    }

    // Fallback: return raw data wrapped in an array
    return Array.isArray(data) ? data : Object.values(data || {})
}
