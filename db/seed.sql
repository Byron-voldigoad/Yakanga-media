-- ============================================================
-- YAKANGA WEB MÉDIA — Seed Data
-- ============================================================

-- 1. Insertion des catégories
insert into public.categories (name, slug, description, color, position, is_active)
values
  ('Actualités', 'actualites', 'Toute l''actualité chaude du continent et d''ailleurs.', '#E11D48', 1, true),
  ('Culture',    'culture',    'Musique, cinéma, littérature et traditions africaines.', '#7C3AED', 2, true),
  ('Sport',      'sport',      'Résultats, analyses et portraits des champions africains.', '#2563EB', 3, true),
  ('Technologie','technologie','Innovation, startups et transformation numérique en Afrique.', '#059669', 4, true),
  ('Politique',  'politique',  'Décryptage des enjeux géopolitiques et gouvernance.', '#D97706', 5, true),
  ('Société',    'societe',    'Tendances, éducation, santé et vie quotidienne.', '#4B5563', 6, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  color = excluded.color,
  position = excluded.position,
  is_active = excluded.is_active;

-- 2. Insertion des articles de test
-- Note: author_id est laissé à NULL car nous n'avons pas d'utilisateurs auth.users créés par défaut.
insert into public.articles (title, slug, excerpt, content, cover_url, category_id, status, created_at, published_at)
values
  (
    'L''essor des startups technologiques à Lagos',
    'essor-startups-lagos',
    'Comment la ville nigériane est devenue le principal hub technologique de l''Afrique de l''Ouest.',
    '<p>Lagos, la mégalopole nigériane, connaît une transformation sans précédent tirée par l''innovation technologique. Des quartiers comme Yaba sont désormais surnommés la "Silicon Lagoon" en raison de la concentration de talents et de capitaux.</p><p>De la fintech à la logistique, les entrepreneurs locaux apportent des solutions concrètes aux défis quotidiens, attirant ainsi les investisseurs du monde entier. Cette dynamique crée des milliers d''emplois et inspire une nouvelle génération de développeurs.</p>',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    (select id from public.categories where slug = 'technologie'),
    'published',
    now(),
    now()
  ),
  (
    'Le retour triomphal de la rumba congolaise',
    'retour-rumba-congolaise',
    'Classée au patrimoine de l''UNESCO, la rumba vit un nouvel âge d''or auprès de la jeunesse.',
    '<p>La rumba congolaise ne s''écoute plus seulement dans les bars de Kinshasa ou de Brazzaville. Elle résonne désormais sur toutes les plateformes de streaming mondiales, portée par des artistes qui marient tradition et modernité.</p><p>Ce genre musical, qui a bercé les indépendances africaines, continue de se réinventer. Entre guitares langoureuses et rythmes dansants, il reste le témoin privilégié de l''histoire sociale et culturelle du bassin du Congo.</p>',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
    (select id from public.categories where slug = 'culture'),
    'published',
    now(),
    now()
  ),
  (
    'Les Lions de la Téranga : en route pour le prochain mondial',
    'lions-teranga-mondial',
    'Analyse des chances du Sénégal pour la prochaine Coupe du Monde après leur titre continental.',
    '<p>Après leur sacre historique en Coupe d''Afrique des Nations, les yeux sont désormais rivés sur la scène mondiale. Le Sénégal dispose d''un effectif complet, mêlant expérience internationale et fougue de la jeunesse.</p><p>Le sélectionneur mise sur une défense solide et une transition rapide vers l''attaque. Les supporters attendent avec impatience de voir si leur équipe pourra briser le plafond de verre et atteindre le dernier carré de la compétition.</p>',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    (select id from public.categories where slug = 'sport'),
    'published',
    now(),
    now()
  ),
  (
    'Défis climatiques : l''Afrique mise sur le solaire',
    'afrique-energie-solaire',
    'De nombreux pays accélèrent leur transition énergétique pour pallier le déficit électrique.',
    '<p>Face au changement climatique et aux besoins croissants en énergie, le continent africain possède un atout majeur : son ensoleillement exceptionnel. Des parcs solaires géants voient le jour du Maroc à l''Afrique du Sud.</p><p>Ces projets permettent notament de réduire l''empreinte carbone, mais aussi d''apporter l''électricité dans des zones rurales reculées. L''indépendance énergétique devient ainsi un levier de développement économique majeur pour la décennie à venir.</p>',
    'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=1200',
    (select id from public.categories where slug = 'actualites'),
    'published',
    now(),
    now()
  ),
  (
    'Élections en Côte d''Ivoire : les enjeux du scrutin',
    'elections-cote-ivoire-enjeux',
    'Décryptage des forces en présence et des attentes de la population civile.',
    '<p>À l''approche des prochaines élections, le climat politique en Côte d''Ivoire est scruté de près par les observateurs internationaux. Les enjeux de stabilité et de croissance économique sont au cœur des débats.</p><p>La population, particulièrement la jeunesse, attend des programmes concrets sur l''emploi, l''éducation et la santé. Le dialogue entre les différents partis sera déterminant pour assurer un processus électoral apaisé et transparent.</p>',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=1200',
    (select id from public.categories where slug = 'politique'),
    'published',
    now(),
    now()
  ),
  (
    'L''éducation des filles : un levier pour le développement',
    'education-filles-developpement',
    'Focus sur les initiatives locales qui favorisent la scolarisation des jeunes femmes.',
    '<p>Partout sur le continent, des associations et des gouvernements se mobilisent pour que chaque fille puisse accéder à une éducation de qualité. Les bénéfices pour la société sont immenses, allant de la réduction de la pauvreté à l''amélioration de la santé publique.</p><p>En investissant dans l''éducation des femmes, c''est tout le tissu économique et social qui se renforce. Les témoignages de réussite se multiplient, montrant que lorsque les barrières tombent, rien ne peut arrêter le potentiel de la jeunesse africaine.</p>',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200',
    (select id from public.categories where slug = 'societe'),
    'published',
    now(),
    now()
  )
on conflict (slug) do nothing;
