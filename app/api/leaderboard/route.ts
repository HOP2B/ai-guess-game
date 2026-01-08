import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        score: 'desc',
      },
      take: 10, // Top 10 users
      include: {
        games: {
          include: {
            theme: true,
          },
        },
      },
    });

    // Calculate win rate and favorite theme for each user
    const usersWithStats = users.map(user => {
      const totalGames = user.games.length;
      const wonGames = user.games.filter(game => game.status === 'completed').length;
      const winRate = totalGames > 0 ? (wonGames / totalGames) * 100 : 0;

      // Calculate favorite theme based on games played
      const themeCounts: { [key: number]: { count: number; name: string } } = {};
      user.games.forEach(game => {
        if (themeCounts[game.themeId]) {
          themeCounts[game.themeId].count++;
        } else {
          themeCounts[game.themeId] = { count: 1, name: game.theme.name };
        }
      });

      let favoriteTheme = null;
      let maxCount = 0;
      for (const themeId in themeCounts) {
        if (themeCounts[themeId].count > maxCount) {
          maxCount = themeCounts[themeId].count;
          favoriteTheme = themeCounts[themeId].name;
        }
      }

      return {
        id: user.id,
        username: user.username,
        score: user.score,
        winRate: Math.round(winRate * 100) / 100, // Round to 2 decimal places
        favoriteTheme: favoriteTheme || 'None',
      };
    });

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}