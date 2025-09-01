<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            // Programming Languages
            ['name' => 'JavaScript', 'category' => 'Programming Language', 'is_popular' => true],
            ['name' => 'TypeScript', 'category' => 'Programming Language', 'is_popular' => true],
            ['name' => 'Python', 'category' => 'Programming Language', 'is_popular' => true],
            ['name' => 'PHP', 'category' => 'Programming Language', 'is_popular' => true],
            ['name' => 'Java', 'category' => 'Programming Language', 'is_popular' => false],
            ['name' => 'C#', 'category' => 'Programming Language', 'is_popular' => false],
            ['name' => 'Go', 'category' => 'Programming Language', 'is_popular' => false],
            ['name' => 'Rust', 'category' => 'Programming Language', 'is_popular' => false],
            
            // Frontend Technologies
            ['name' => 'React', 'category' => 'Frontend Framework', 'is_popular' => true],
            ['name' => 'Vue.js', 'category' => 'Frontend Framework', 'is_popular' => true],
            ['name' => 'Angular', 'category' => 'Frontend Framework', 'is_popular' => false],
            ['name' => 'Svelte', 'category' => 'Frontend Framework', 'is_popular' => false],
            ['name' => 'Next.js', 'category' => 'Frontend Framework', 'is_popular' => true],
            ['name' => 'Nuxt.js', 'category' => 'Frontend Framework', 'is_popular' => false],
            
            // Backend Technologies
            ['name' => 'Node.js', 'category' => 'Backend Framework', 'is_popular' => true],
            ['name' => 'Laravel', 'category' => 'Backend Framework', 'is_popular' => true],
            ['name' => 'Express.js', 'category' => 'Backend Framework', 'is_popular' => true],
            ['name' => 'Django', 'category' => 'Backend Framework', 'is_popular' => false],
            ['name' => 'Flask', 'category' => 'Backend Framework', 'is_popular' => false],
            ['name' => 'Spring Boot', 'category' => 'Backend Framework', 'is_popular' => false],
            
            // Databases
            ['name' => 'MySQL', 'category' => 'Database', 'is_popular' => true],
            ['name' => 'PostgreSQL', 'category' => 'Database', 'is_popular' => true],
            ['name' => 'MongoDB', 'category' => 'Database', 'is_popular' => true],
            ['name' => 'Redis', 'category' => 'Database', 'is_popular' => false],
            ['name' => 'SQLite', 'category' => 'Database', 'is_popular' => false],
            
            // Cloud & DevOps
            ['name' => 'AWS', 'category' => 'Cloud Platform', 'is_popular' => true],
            ['name' => 'Docker', 'category' => 'DevOps', 'is_popular' => true],
            ['name' => 'Kubernetes', 'category' => 'DevOps', 'is_popular' => false],
            ['name' => 'Google Cloud', 'category' => 'Cloud Platform', 'is_popular' => false],
            ['name' => 'Azure', 'category' => 'Cloud Platform', 'is_popular' => false],
            ['name' => 'Vercel', 'category' => 'Cloud Platform', 'is_popular' => false],
            
            // Design & UI/UX
            ['name' => 'Figma', 'category' => 'Design Tool', 'is_popular' => true],
            ['name' => 'Adobe XD', 'category' => 'Design Tool', 'is_popular' => false],
            ['name' => 'Sketch', 'category' => 'Design Tool', 'is_popular' => false],
            ['name' => 'UI/UX Design', 'category' => 'Design Skill', 'is_popular' => true],
            ['name' => 'Prototyping', 'category' => 'Design Skill', 'is_popular' => false],
            ['name' => 'User Research', 'category' => 'Design Skill', 'is_popular' => false],
            
            // Data Science & AI
            ['name' => 'Machine Learning', 'category' => 'Data Science', 'is_popular' => true],
            ['name' => 'TensorFlow', 'category' => 'Data Science', 'is_popular' => false],
            ['name' => 'PyTorch', 'category' => 'Data Science', 'is_popular' => false],
            ['name' => 'Pandas', 'category' => 'Data Science', 'is_popular' => false],
            ['name' => 'Scikit-learn', 'category' => 'Data Science', 'is_popular' => false],
            ['name' => 'Data Analysis', 'category' => 'Data Science', 'is_popular' => false],
            
            // Other Technologies
            ['name' => 'GraphQL', 'category' => 'API Technology', 'is_popular' => false],
            ['name' => 'REST API', 'category' => 'API Technology', 'is_popular' => true],
            ['name' => 'Git', 'category' => 'Version Control', 'is_popular' => true],
            ['name' => 'GitHub', 'category' => 'Version Control', 'is_popular' => true],
            ['name' => 'CI/CD', 'category' => 'DevOps', 'is_popular' => false],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}