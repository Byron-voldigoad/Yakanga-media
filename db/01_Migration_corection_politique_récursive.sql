-- Supprimer la politique récursive
DROP POLICY "Admin gère tous les profils" ON profiles;

-- La recréer sans récursion (lecture du JWT au lieu de la table)
CREATE POLICY "Admin gère tous les profils" ON profiles
FOR ALL
USING (
  (auth.jwt() ->> 'role') = 'admin'
  OR auth.uid() = id
)
WITH CHECK (
  (auth.jwt() ->> 'role') = 'admin'
  OR auth.uid() = id
);