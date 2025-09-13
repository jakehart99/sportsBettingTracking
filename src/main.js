const gameTimesData = `Georgia @ Tennessee: Saturday, September 13, 2025, at 2:30 p.m. CST
Diego Lopes vs Jean Silva: Saturday, September 13, 2025, main card starts at 5:00 p.m. CST
Baltimore Orioles @ Toronto Blue Jays: Saturday, September 13, 2025, inferred to be around 6:07 p.m. CST (Time not officially confirmed in the report)
New York Yankees @ Boston Red Sox: Saturday, September 13, 2025, inferred to be around 6:10 p.m. CST (Time not officially confirmed in the report)
Colorado Rockies @ San Diego Padres: Saturday, September 13, 2025, at 7:40 p.m. CST
Saul 'Canelo' Alvarez vs Terence Crawford: Saturday, September 13, 2025, main card starts at 8:00 p.m. CST
Carolina Panthers @ Arizona Cardinals: September 14, 2025. 3:05pm CST
New York Giants @ Dallas Cowboys: September 14, 2025. 12pm CST`;

const betsData = `9/13/25
1:12 PM
Placed - 4 Team Parlay
To Win $ 102.10
Tennessee +3.5 (-110)
(131) Georgia @ (132) Tennessee
Arizona Cardinals -7 (-110)
(269) Carolina Panthers @ (270) Arizona Cardinals
Over 8 (-115)
Colorado Rockies @ San Diego Padres
New York Yankees (-155)
New York Yankees @ Boston Red Sox

CASH OUT
$ 10.00
9/13/25
12:52 PM
Placed - 5 Team Parlay
To Win $ 613.61
Dallas Cowboys -6 (-110)
(257) New York Giants @ (258) Dallas Cowboys
Under 44.5 (-110)
(269) Carolina Panthers @ (270) Arizona Cardinals
Toronto Blue Jays -1.5 (+120)
Baltimore Orioles @ Toronto Blue Jays
Terence Crawford (+155)
Saul 'Canelo' Alvarez vs Terence Crawford
Diego Lopes (+205)
Diego Lopes vs Jean Silva`;

function parseGameTimes() {
  const games = [];
  const lines = gameTimesData.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const matchup = line.substring(0, colonIndex).trim();
    const timeInfo = line.substring(colonIndex + 1).trim();
    
    let time = 'TBD';
    let confirmed = true;
    let date = 'September 13, 2025';
    
    if (timeInfo.includes('at ')) {
      const timeMatch = timeInfo.match(/at (\d+:\d+\s+[ap]\.m\.\s+CST)/);
      if (timeMatch) time = timeMatch[1];
    } else if (timeInfo.includes('main card starts at ')) {
      const timeMatch = timeInfo.match(/main card starts at (\d+:\d+\s+[ap]\.m\.\s+CST)/);
      if (timeMatch) time = timeMatch[1];
    } else if (timeInfo.includes('inferred to be around ')) {
      const timeMatch = timeInfo.match(/around (\d+:\d+\s+[ap]\.m\.\s+CST)/);
      if (timeMatch) {
        time = timeMatch[1];
        confirmed = false;
      }
    } else if (timeInfo.includes('September 14, 2025')) {
      date = 'September 14, 2025';
      const timeMatch = timeInfo.match(/(\d+(?::\d+)?[ap]m)\s+CST/);
      if (timeMatch) {
        let rawTime = timeMatch[1];
        if (!rawTime.includes(':')) {
          rawTime = rawTime.replace(/([ap]m)/, ':00$1');
        }
        time = rawTime.replace(/([ap])m/, '.$1.m. CST');
      }
    }
    
    games.push({ matchup, time, confirmed, date });
  });
  
  return games;
}

function parseBets() {
  const bets = [];
  const lines = betsData.split('\n');
  
  let i = 0;
  let parlayCounter = 1;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Look for date pattern (e.g., "9/13/25")
    if (line.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/)) {
      const date = line;
      const time = lines[i + 1]?.trim() || '';
      const parlayInfo = lines[i + 2]?.trim() || '';
      const winAmount = lines[i + 3]?.trim() || '';
      
      // Extract parlay details
      const teamCountMatch = parlayInfo.match(/(\d+)\s+Team\s+Parlay/);
      const teamCount = teamCountMatch ? parseInt(teamCountMatch[1]) : 0;
      const winAmountMatch = winAmount.match(/\$\s*([\d,]+\.?\d*)/);
      const winValue = winAmountMatch ? winAmountMatch[1] : '0';
      
      // Skip to the bets section
      i += 4;
      
      // Collect all bets for this parlay
      const parlayBets = [];
      let betLine = '';
      let matchupLine = '';
      
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('CASH OUT') && !lines[i].trim().match(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/)) {
        const currentLine = lines[i].trim();
        
        // Bet lines contain odds in parentheses or start with Over/Under
        if (currentLine.includes('(') && currentLine.includes(')') && (currentLine.includes('+') || currentLine.includes('-')) || currentLine.startsWith('Over ') || currentLine.startsWith('Under ')) {
          betLine = currentLine;
        }
        // Matchup lines contain @ or vs
        else if ((currentLine.includes('@') || currentLine.includes('vs')) && betLine) {
          matchupLine = currentLine.replace(/^\(\d+\)\s*/, '').replace(/\s*@\s*\(\d+\)\s*/, ' @ ');
          
          parlayBets.push({
            bet: betLine,
            matchup: matchupLine,
            parlayId: parlayCounter,
            parlayType: `${teamCount} Team Parlay`,
            date: date,
            time: time,
            winAmount: `$${winValue}`,
            status: 'pending',
            week: 'Sep 13-14, 2025',
            weekId: 'week1'
          });
          
          betLine = '';
          matchupLine = '';
        }
        
        i++;
      }
      
      bets.push(...parlayBets);
      parlayCounter++;
      
      // Skip CASH OUT section if present
      if (i < lines.length && lines[i].trim().startsWith('CASH OUT')) {
        i += 2; // Skip "CASH OUT" and amount
      }
    } else {
      i++;
    }
  }
  
  return bets;
}

const weekData = {
  'week1': {
    id: 'week1',
    name: 'This Weekend',
    dates: 'Sep 13-14, 2025',
    active: true
  },
  'week2': {
    id: 'week2',
    name: 'Next Weekend',
    dates: 'Sep 20-21, 2025',
    active: false
  },
  'week3': {
    id: 'week3',
    name: 'Week 3',
    dates: 'Sep 27-28, 2025',
    active: false
  }
};

let currentWeek = 'week1';
let globalBets = [];
let globalGames = [];
let gameResults = {}; // Store individual game results

function getSportEmoji(matchup) {
  if (matchup.includes('@') && !matchup.includes('vs')) {
    if (matchup.toLowerCase().includes('panthers') || matchup.toLowerCase().includes('cardinals') || 
        matchup.toLowerCase().includes('giants') || matchup.toLowerCase().includes('cowboys')) {
      return '🏈';
    } else if (matchup.toLowerCase().includes('orioles') || matchup.toLowerCase().includes('jays') || 
               matchup.toLowerCase().includes('yankees') || matchup.toLowerCase().includes('sox') ||
               matchup.toLowerCase().includes('rockies') || matchup.toLowerCase().includes('padres')) {
      return '⚾';
    } else {
      return '🏀';
    }
  } else if (matchup.includes('vs')) {
    return '🥊';
  }
  return '🎯';
}

function getBetTypeEmoji(bet) {
  if (bet.includes('Over') || bet.includes('Under')) return '📊';
  if (bet.includes('+') || bet.includes('-')) return '📈';
  return '🎯';
}

function renderStats(bets) {
  // Count parlays instead of individual bets
  const parlayIds = new Set(bets.map(bet => bet.parlayId));
  const totalParlays = parlayIds.size;
  
  // Count parlays by status
  const parlaysByStatus = {};
  parlayIds.forEach(parlayId => {
    const parlayBets = bets.filter(bet => bet.parlayId === parlayId);
    const parlayStatus = parlayBets[0].status; // All bets in a parlay share the same status
    parlaysByStatus[parlayStatus] = (parlaysByStatus[parlayStatus] || 0) + 1;
  });
  
  const pendingParlays = parlaysByStatus['pending'] || 0;
  const wonParlays = parlaysByStatus['won'] || 0;
  const winRate = totalParlays > 0 ? Math.round((wonParlays / totalParlays) * 100) : 0;
  
  document.getElementById('total-bets').textContent = totalParlays;
  document.getElementById('win-rate').textContent = `${winRate}%`;
  document.getElementById('upcoming-bets').textContent = pendingParlays;
  document.getElementById('active-bets').textContent = pendingParlays;
}

function renderTodaysGames(games) {
  const container = document.getElementById('todays-games');
  
  if (games.length === 0) {
    container.innerHTML = '<p class="text-white/70 text-center">No games scheduled</p>';
    return;
  }
  
  const today = new Date();
  const isToday13th = today.getDate() === 13;
  const todaysGames = isToday13th ? 
    games.filter(game => game.date === 'September 13, 2025') : 
    games;
  
  container.innerHTML = todaysGames.map(game => {
    const isToday = game.date === 'September 13, 2025' && isToday13th;
    const isTomorrow = game.date === 'September 14, 2025';

    return `
      <div class="card card-compact game-result-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${getSportEmoji(game.matchup)}</span>
            <div>
              <h3 class="text-white-readable font-semibold mb-1">${game.matchup}</h3>
              <p class="text-muted text-sm">${game.time}</p>
              <p class="text-subtle text-xs">${game.date}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${!game.confirmed ? '<span class="badge badge-warning">Time Unconfirmed</span>' : ''}
            ${isToday ? '<span class="badge badge-success">Today</span>' : ''}
            ${isTomorrow ? '<span class="badge badge-info">Tomorrow</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderWeekendBets(bets) {
  const container = document.getElementById('weekend-bets');
  const weekendBets = bets.filter(bet => bet.weekId === currentWeek);
  
  if (weekendBets.length === 0) {
    container.innerHTML = '<p class="text-white/70 text-center col-span-full">No bets for this weekend</p>';
    return;
  }
  
  // Group bets by parlay
  const parlayGroups = {};
  weekendBets.forEach(bet => {
    if (!parlayGroups[bet.parlayId]) {
      parlayGroups[bet.parlayId] = [];
    }
    parlayGroups[bet.parlayId].push(bet);
  });
  
  const parlayCards = Object.values(parlayGroups).slice(0, 2).map((parlayBets, index) => {
    const firstBet = parlayBets[0];
    const statusClass = firstBet.status === 'won' ? 'badge-success' : firstBet.status === 'lost' ? 'badge-error' : 'badge-warning';
    return `
      <div class="card bet-card card-interactive animate-slide-up"
           style="animation-delay: ${index * 0.1}s"
           onclick="toggleParlayStatus(${firstBet.parlayId})">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🎯</span>
            <div>
              <h3 class="text-white-readable font-semibold">${firstBet.parlayType}</h3>
              <p class="text-muted text-sm">${firstBet.date} at ${firstBet.time}</p>
            </div>
          </div>
          <span class="badge ${statusClass}">
            ${firstBet.status.charAt(0).toUpperCase() + firstBet.status.slice(1)}
          </span>
        </div>

        <div class="mb-4">
          <p class="text-lg font-semibold" style="color: #10b981;">To Win: ${firstBet.winAmount}</p>
        </div>

        <div class="space-y-2 mb-4">
          ${parlayBets.slice(0, 3).map(bet => `
            <div class="text-sm">
              <div class="text-white-readable font-medium">${bet.bet}</div>
              <div class="text-muted text-xs">${bet.matchup}</div>
            </div>
          `).join('')}
          ${parlayBets.length > 3 ? `<div class="text-muted text-sm">+${parlayBets.length - 3} more bets</div>` : ''}
        </div>

        <p class="text-subtle text-xs text-center">Click to change status</p>
      </div>
    `;
  }).join('');
  
  container.innerHTML = parlayCards;
  
  if (Object.keys(parlayGroups).length > 2) {
    container.innerHTML += `
      <div class="card card-interactive text-center" onclick="showMyBets()">
        <div class="text-3xl mb-3">👀</div>
        <h3 class="text-white-readable font-semibold mb-2">+${Object.keys(parlayGroups).length - 2} more parlays</h3>
        <p class="text-muted text-sm">Click to view all</p>
      </div>
    `;
  }
}

function renderBets(bets, weekFilter = null) {
  const container = document.getElementById('bets-grid');
  const filteredBets = weekFilter ? bets.filter(bet => bet.weekId === weekFilter) : bets.filter(bet => bet.weekId === currentWeek);
  
  if (filteredBets.length === 0) {
    container.innerHTML = '<p class="text-white/70 text-center col-span-full">No bets found for this week</p>';
    return;
  }
  
  // Group bets by parlay
  const parlayGroups = {};
  filteredBets.forEach(bet => {
    if (!parlayGroups[bet.parlayId]) {
      parlayGroups[bet.parlayId] = [];
    }
    parlayGroups[bet.parlayId].push(bet);
  });
  
  const parlayCards = Object.values(parlayGroups).map((parlayBets, index) => {
    const firstBet = parlayBets[0];
    const statusClass = firstBet.status === 'won' ? 'badge-success' : firstBet.status === 'lost' ? 'badge-error' : 'badge-warning';
    return `
      <div class="card bet-card card-interactive animate-slide-up"
           style="animation-delay: ${index * 0.1}s"
           onclick="toggleParlayStatus(${firstBet.parlayId})">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎯</span>
            <div>
              <h3 class="text-white-readable font-bold text-lg">${firstBet.parlayType}</h3>
              <p class="text-lg font-semibold" style="color: #10b981;">To Win: ${firstBet.winAmount}</p>
            </div>
          </div>
          <span class="badge ${statusClass}">
            ${firstBet.status.charAt(0).toUpperCase() + firstBet.status.slice(1)}
          </span>
        </div>

        <div class="space-y-4 mb-4">
          ${parlayBets.map(bet => `
            <div class="pl-4 border-l-2" style="border-color: var(--color-primary);">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xl">${getSportEmoji(bet.matchup)}</span>
                <span class="text-lg">${getBetTypeEmoji(bet.bet)}</span>
              </div>
              <h4 class="text-white-readable font-semibold mb-1">${bet.matchup}</h4>
              <p class="text-muted text-sm">${bet.bet}</p>
            </div>
          `).join('')}
        </div>

        <div class="flex items-center justify-between text-sm pt-4 border-t" style="border-color: rgba(255, 255, 255, 0.1);">
          <span class="text-muted">${firstBet.date} at ${firstBet.time}</span>
          <span class="badge badge-neutral">${parlayBets.length} legs</span>
        </div>

        <p class="text-subtle text-xs mt-3 text-center">Click to change status</p>
      </div>
    `;
  }).join('');
  
  container.innerHTML = parlayCards;
}

function renderGamesSchedule(games, bets) {
  const container = document.getElementById('games-schedule');
  
  // Get all unique matchups from bets to know which games we have bets on
  const betMatchups = new Set();
  bets.forEach(bet => {
    // Clean up matchup names to match game data
    let cleanMatchup = bet.matchup;
    if (cleanMatchup.includes('@')) {
      // Handle format like "Georgia @ Tennessee"
      betMatchups.add(cleanMatchup);
    } else if (cleanMatchup.includes('vs')) {
      // Handle format like "Saul 'Canelo' Alvarez vs Terence Crawford"
      betMatchups.add(cleanMatchup);
    }
  });
  
  // Filter games to only show ones we have bets on
  const relevantGames = games.filter(game => {
    return Array.from(betMatchups).some(betMatchup => {
      // More flexible matching
      const gameTeams = game.matchup.toLowerCase().replace(/['"]/g, '');
      const betTeams = betMatchup.toLowerCase().replace(/['"]/g, '');
      
      if (gameTeams.includes('@') && betTeams.includes('@')) {
        // Both are team vs team format
        const gameTeamsParts = gameTeams.split('@').map(t => t.trim());
        const betTeamsParts = betTeams.split('@').map(t => t.trim());
        return (gameTeamsParts[0].includes(betTeamsParts[0].split(' ').pop()) && 
                gameTeamsParts[1].includes(betTeamsParts[1].split(' ').pop())) ||
               (gameTeamsParts[1].includes(betTeamsParts[0].split(' ').pop()) && 
                gameTeamsParts[0].includes(betTeamsParts[1].split(' ').pop()));
      } else if (gameTeams.includes('vs') && betTeams.includes('vs')) {
        // Both are fighter vs fighter format
        return gameTeams === betTeams;
      }
      
      return false;
    });
  });
  
  if (relevantGames.length === 0) {
    container.innerHTML = '<p class="text-white/70 text-center">No game schedule available for your bets</p>';
    return;
  }
  
  // Group games by date
  const gamesByDate = {};
  relevantGames.forEach(game => {
    if (!gamesByDate[game.date]) {
      gamesByDate[game.date] = [];
    }
    gamesByDate[game.date].push(game);
  });
  
  const dateCards = Object.entries(gamesByDate).map(([date, dayGames]) => {
    const isToday = date === 'September 13, 2025';
    const isTomorrow = date === 'September 14, 2025';

    return `
      <div class="card card-large">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white-readable">${date}</h3>
          <div class="flex items-center gap-2">
            ${isToday ? '<span class="badge badge-success">Today</span>' : ''}
            ${isTomorrow ? '<span class="badge badge-info">Tomorrow</span>' : ''}
          </div>
        </div>

        <div class="space-y-3">
          ${dayGames.map(game => {
            const gameStatus = getGameResultStatus(game.matchup);
            const statusClasses = {
              'pending': 'border-orange-500/30 bg-orange-500/5',
              'won': 'border-green-500/30 bg-green-500/5',
              'lost': 'border-red-500/30 bg-red-500/5'
            };
            const statusLabels = {
              'pending': 'Click to Set Result',
              'won': 'Won ✓',
              'lost': 'Lost ✗'
            };
            const statusBadges = {
              'pending': 'badge-warning',
              'won': 'badge-success',
              'lost': 'badge-error'
            };

            return `
            <div class="card card-compact game-result-card ${statusClasses[gameStatus]} border-2"
                 onclick="toggleGameResult('${game.matchup.replace(/'/g, '\\\'').replace(/"/g, '\\"')}')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <span class="text-3xl">${getSportEmoji(game.matchup)}</span>
                  <div>
                    <h4 class="text-white-readable font-semibold text-lg mb-1">${game.matchup}</h4>
                    <div class="flex items-center gap-3">
                      <p class="text-muted">${game.time}</p>
                      ${!game.confirmed ? '<span class="badge badge-warning">Time Unconfirmed</span>' : ''}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="badge badge-info">Bet Placed</span>
                  <span class="badge ${statusBadges[gameStatus]}">
                    ${statusLabels[gameStatus]}
                  </span>
                </div>
              </div>
            </div>
          `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = dateCards;
}

function toggleGameResult(gameMatchup) {
  const gameKey = gameMatchup.toLowerCase().replace(/['"]/g, '');

  if (!gameResults[gameKey]) {
    gameResults[gameKey] = 'pending';
  }

  // Add haptic feedback (if supported)
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }

  // Cycle through statuses: pending -> won -> lost -> pending
  switch (gameResults[gameKey]) {
    case 'pending':
      gameResults[gameKey] = 'won';
      break;
    case 'won':
      gameResults[gameKey] = 'lost';
      break;
    case 'lost':
      gameResults[gameKey] = 'pending';
      break;
    default:
      gameResults[gameKey] = 'pending';
  }

  // Save to localStorage
  saveGameResults();

  // Show quick visual feedback
  const gameCards = document.querySelectorAll('.game-result-card');
  gameCards.forEach(card => {
    if (card.getAttribute('onclick')?.includes(gameMatchup)) {
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    }
  });

  // Refresh displays
  refreshAllDisplays();
}

function saveGameResults() {
  try {
    localStorage.setItem('sportsTracker_gameResults', JSON.stringify(gameResults));
  } catch (error) {
    console.warn('Could not save game results to localStorage:', error);
  }
}

function loadGameResults() {
  try {
    const saved = localStorage.getItem('sportsTracker_gameResults');
    if (saved) {
      gameResults = JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Could not load game results from localStorage:', error);
    gameResults = {};
  }
}

function getGameResultStatus(gameMatchup) {
  const gameKey = gameMatchup.toLowerCase().replace(/['"]/g, '');
  return gameResults[gameKey] || 'pending';
}

function toggleParlayStatus(parlayId) {
  // Find all bets in the parlay
  const parlayBets = globalBets.filter(bet => bet.parlayId === parlayId);
  if (parlayBets.length === 0) return;

  // Add haptic feedback (if supported)
  if (navigator.vibrate) {
    navigator.vibrate(75);
  }

  const currentStatus = parlayBets[0].status;
  let newStatus;

  // Cycle through statuses: pending -> won -> lost -> pending
  switch (currentStatus) {
    case 'pending':
      newStatus = 'won';
      break;
    case 'won':
      newStatus = 'lost';
      break;
    case 'lost':
      newStatus = 'pending';
      break;
    default:
      newStatus = 'pending';
  }

  // Update all bets in the parlay
  globalBets.forEach(bet => {
    if (bet.parlayId === parlayId) {
      bet.status = newStatus;
    }
  });

  // Show quick visual feedback
  const betCards = document.querySelectorAll('.bet-card');
  betCards.forEach(card => {
    if (card.getAttribute('onclick')?.includes(parlayId.toString())) {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => {
        card.style.transform = '';
      }, 200);
    }
  });

  // Refresh all displays
  refreshAllDisplays();
}

function showLoadingState(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.classList.add('loading');
    container.style.opacity = '0.7';
  }
}

function hideLoadingState(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.classList.remove('loading');
    container.style.opacity = '1';
  }
}

function refreshAllDisplays() {
  // Show loading states
  showLoadingState('weekend-bets');
  showLoadingState('todays-games');
  showLoadingState('bets-grid');

  // Small delay to show loading effect
  setTimeout(() => {
    renderStats(globalBets);
    renderTodaysGames(globalGames);
    renderWeekendBets(globalBets);
    renderBets(globalBets);

    // Hide loading states
    hideLoadingState('weekend-bets');
    hideLoadingState('todays-games');
    hideLoadingState('bets-grid');

    // Only render games schedule if we're on the My Bets page
    const betsSection = document.getElementById('bets');
    if (!betsSection.classList.contains('hidden')) {
      showLoadingState('games-schedule');
      setTimeout(() => {
        renderGamesSchedule(globalGames, globalBets);
        hideLoadingState('games-schedule');
      }, 100);
    }
  }, 150);
}

function showMyBets() {
  const dashboardSection = document.getElementById('dashboard');
  const betsSection = document.getElementById('bets');
  const dashboardBtn = document.getElementById('dashboard-btn');
  const betsBtn = document.getElementById('bets-btn');
  
  betsSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
  betsBtn.classList.add('bg-white/20');
  dashboardBtn.classList.remove('bg-white/20');
  
  // Render the games schedule when showing My Bets page
  renderGamesSchedule(globalGames, globalBets);
}

function setupNavigation() {
  const dashboardBtn = document.getElementById('dashboard-btn');
  const betsBtn = document.getElementById('bets-btn');
  const dashboardSection = document.getElementById('dashboard');
  const betsSection = document.getElementById('bets');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-menu-open');
    });
  }

  function navigateTo(section) {
    if (section === 'dashboard') {
      dashboardSection.classList.remove('hidden');
      betsSection.classList.add('hidden');
      dashboardBtn.classList.add('active');
      betsBtn.classList.remove('active');
    } else {
      betsSection.classList.remove('hidden');
      dashboardSection.classList.add('hidden');
      betsBtn.classList.add('active');
      dashboardBtn.classList.remove('active');
      renderGamesSchedule(globalGames, globalBets);
    }

    // Close mobile menu
    if (navMenu.classList.contains('mobile-menu-open')) {
      navMenu.classList.remove('mobile-menu-open');
    }
  }

  dashboardBtn.addEventListener('click', () => navigateTo('dashboard'));
  betsBtn.addEventListener('click', () => navigateTo('bets'));

  dashboardBtn.classList.add('active');
}

function setupFilters(bets) {
  const filterButtons = ['filter-all', 'filter-pending', 'filter-won', 'filter-lost'];
  
  filterButtons.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    button.addEventListener('click', () => {
      filterButtons.forEach(id => {
        document.getElementById(id).classList.remove('active');
      });
      button.classList.add('active');

      const filter = buttonId.replace('filter-', '');
      const currentWeekBets = globalBets.filter(bet => bet.weekId === currentWeek);
      const filteredBets = filter === 'all' ? currentWeekBets : currentWeekBets.filter(bet => bet.status === filter);
      renderBets(filteredBets, currentWeek);
    });
  });
}

function setupWeekNavigation(bets) {
  // Week selector buttons
  const weekButtons = ['week-current', 'week-next-1', 'week-next-2'];
  
  weekButtons.forEach((buttonId, index) => {
    const button = document.getElementById(buttonId);
    const weekId = `week${index + 1}`;
    
    button.addEventListener('click', () => {
      currentWeek = weekId;
      updateCurrentWeekDisplay();
      renderBets(globalBets, currentWeek);
      updateWeekButtonStyles();
      
      // Update games schedule for the new week
      renderGamesSchedule(globalGames, globalBets);
    });
  });
  
  // Previous/Next navigation
  document.getElementById('week-prev').addEventListener('click', () => {
    const weekIds = Object.keys(weekData);
    const currentIndex = weekIds.indexOf(currentWeek);
    if (currentIndex > 0) {
      currentWeek = weekIds[currentIndex - 1];
      updateCurrentWeekDisplay();
      renderBets(globalBets, currentWeek);
      updateWeekButtonStyles();
      
      // Update games schedule for the new week
      renderGamesSchedule(globalGames, globalBets);
    }
  });
  
  document.getElementById('week-next').addEventListener('click', () => {
    const weekIds = Object.keys(weekData);
    const currentIndex = weekIds.indexOf(currentWeek);
    if (currentIndex < weekIds.length - 1) {
      currentWeek = weekIds[currentIndex + 1];
      updateCurrentWeekDisplay();
      renderBets(globalBets, currentWeek);
      updateWeekButtonStyles();
      
      // Update games schedule for the new week
      renderGamesSchedule(globalGames, globalBets);
    }
  });
}

function updateCurrentWeekDisplay() {
  const displayElement = document.getElementById('current-week-display');
  displayElement.textContent = `Week of ${weekData[currentWeek].dates}`;
}

function updateWeekButtonStyles() {
  const weekButtons = ['week-current', 'week-next-1', 'week-next-2'];

  weekButtons.forEach((buttonId, index) => {
    const button = document.getElementById(buttonId);
    const weekId = `week${index + 1}`;

    if (weekId === currentWeek) {
      button.style.background = 'rgba(37, 99, 235, 0.15)';
      button.style.borderColor = 'rgba(37, 99, 235, 0.3)';
    } else {
      button.style.background = '';
      button.style.borderColor = '';
    }
  });
}

function init() {
  // Load saved game results first
  loadGameResults();

  globalGames = parseGameTimes();
  globalBets = parseBets();

  renderStats(globalBets);
  renderTodaysGames(globalGames);
  renderWeekendBets(globalBets);
  renderBets(globalBets);
  setupNavigation();
  setupFilters(globalBets);
  setupWeekNavigation(globalBets);
  updateCurrentWeekDisplay();
  updateWeekButtonStyles();

  console.log('Sports Betting Tracker initialized!');
  console.log(`Found ${globalGames.length} games and ${globalBets.length} individual bets`);

  // Group by parlay to show parlay count
  const parlayIds = new Set(globalBets.map(bet => bet.parlayId));
  console.log(`Organized into ${parlayIds.size} parlays`);

  // Show parlay details
  parlayIds.forEach(parlayId => {
    const parlayBets = globalBets.filter(bet => bet.parlayId === parlayId);
    const firstBet = parlayBets[0];
    console.log(`Parlay ${parlayId}: ${firstBet.parlayType} - ${firstBet.winAmount} (${parlayBets.length} legs)`);
  });

  // Log loaded game results
  console.log('Loaded game results:', gameResults);
}

// Make functions globally accessible
window.toggleGameResult = toggleGameResult;
window.toggleParlayStatus = toggleParlayStatus;
window.showMyBets = showMyBets;

document.addEventListener('DOMContentLoaded', init);