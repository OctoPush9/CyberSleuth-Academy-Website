document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const filterButtons = document.querySelectorAll('.filter-button');
    const countryFilter = document.getElementById('countryFilter');
    const topUsersContainer = document.getElementById('topUsersContainer');
    const leaderboardBody = document.getElementById('leaderboardBody');

    // Current filter state
    let currentPeriod = 'all-time';
    let currentCountry = 'all';

    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current period
            currentPeriod = button.dataset.period;
            
            // Apply filters
            applyFilters();
        });
    });

    // Add event listener to country filter
    countryFilter.addEventListener('change', () => {
        currentCountry = countryFilter.value;
        applyFilters();
    });

    // Apply filters and update the leaderboard
    function applyFilters() {
        // Fetch filtered data from server (AJAX)
        fetch('api/get_leaderboard.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                period: currentPeriod,
                country: currentCountry
            })
        })
        .then(response => response.json())
        .then(data => {
            // Update top users (first 5)
            const topUsers = data.slice(0, 5);
            renderTopUsers(topUsers);

            // Update table rows (remaining users)
            const tableUsers = data.slice(5);
            renderTableRows(tableUsers);
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error);
        });
    }

    // Render top users section
    function renderTopUsers(users) {
        topUsersContainer.innerHTML = '';
        
        if (users.length === 0) {
            topUsersContainer.innerHTML = '<p class="no-users">No users match the current filters.</p>';
            return;
        }

        users.forEach((user, index) => {
            const topUserElement = document.createElement('div');
            topUserElement.className = 'top-user';
            topUserElement.innerHTML = `
                <span class="rank">${index + 1}</span>
                <img src="assets/images/user${user.id}.jpg" 
                     alt="${user.username}" 
                     class="profile-pic"
                     onerror="this.onerror=null; this.src='assets/images/default-user.png';">
                <div class="user-info">
                    <h3>${user.username}</h3>
                    <p>Points: ${user.points}</p>
                    <p>Rooms in: ${user.rooms_completed}</p>
                    <p>Country: ${user.country}</p>
                </div>
            `;
            topUsersContainer.appendChild(topUserElement);
        });
    }

    // Render table rows
    function renderTableRows(users) {
        leaderboardBody.innerHTML = '';
        
        if (users.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" class="no-data">No additional users match the current filters.</td>';
            leaderboardBody.appendChild(row);
            return;
        }

        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 6}</td>
                <td>
                    <img src="assets/images/user${user.id}.jpg" 
                         alt="${user.username}" 
                         class="profile-pic-small"
                         onerror="this.onerror=null; this.src='assets/images/default-user.png';">
                    ${user.username}
                </td>
                <td>${user.country}</td>
                <td>${user.points}</td>
                <td>${user.rooms_completed}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }

    // Initial render
    applyFilters();

    // Real-time update every 30 seconds
    setInterval(() => {
        applyFilters();
    }, 30000);
});