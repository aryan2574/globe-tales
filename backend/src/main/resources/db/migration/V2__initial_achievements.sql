-- Insert initial achievements
INSERT INTO achievements (code, title, description, category, difficulty, points) VALUES
('FIRST_VISIT', 'First Steps', 'Visit your first cultural site', 'Exploration', 'Easy', 10),
('CULTURE_SEEKER', 'Culture Seeker', 'Visit 5 different cultural sites', 'Exploration', 'Medium', 50),
('HERITAGE_EXPLORER', 'Heritage Explorer', 'Visit 10 different cultural sites', 'Exploration', 'Hard', 100),
('LOCAL_GUIDE', 'Local Guide', 'Visit 5 sites in the same city', 'Local Knowledge', 'Medium', 75),
('WORLD_TRAVELER', 'World Traveler', 'Visit sites in 3 different countries', 'Global Explorer', 'Hard', 150),
('EARLY_BIRD', 'Early Bird', 'Visit a site during its opening hours', 'Timing', 'Easy', 25),
('NIGHT_OWL', 'Night Owl', 'Visit a site during evening hours', 'Timing', 'Medium', 50),
('PHOTOGRAPHER', 'Cultural Photographer', 'Take photos at 5 different sites', 'Documentation', 'Medium', 75),
('HISTORY_BUFF', 'History Buff', 'Visit 3 historical monuments', 'Knowledge', 'Medium', 60),
('ART_LOVER', 'Art Lover', 'Visit 3 art galleries or museums', 'Arts', 'Medium', 60); 