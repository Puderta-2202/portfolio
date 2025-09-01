<?php

namespace Database\Seeders;

use App\Models\Portfolio;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Education;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Portfolio 1: Full Stack Developer
        $portfolio1 = Portfolio::create([
            'name' => 'Ahmad Rizki Pratama',
            'title' => 'Full Stack Developer',
            'email' => 'ahmad.rizki@email.com',
            'phone' => '+62 812-3456-7890',
            'location' => 'Jakarta, Indonesia',
            'bio' => 'Passionate full stack developer dengan 5+ tahun pengalaman dalam membangun aplikasi web modern. Expertise dalam React, Node.js, dan teknologi cloud.',
            'profile_image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/ahmadrizkipratama',
                'github' => 'https://github.com/ahmadrizki',
                'website' => 'https://ahmadrizki.dev'
            ]
        ]);

        // Add skills to portfolio 1
        $skills1 = ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'];
        foreach ($skills1 as $skillName) {
            $skill = Skill::where('name', $skillName)->first();
            if ($skill) {
                $portfolio1->skills()->attach($skill->id, ['proficiency_level' => rand(3, 5)]);
            }
        }

        // Add experience to portfolio 1
        Experience::create([
            'portfolio_id' => $portfolio1->id,
            'company' => 'PT Teknologi Digital',
            'position' => 'Senior Full Stack Developer',
            'start_date' => '2022-01-01',
            'end_date' => null,
            'description' => 'Memimpin tim pengembangan aplikasi e-commerce dengan 1M+ pengguna aktif. Mengimplementasikan microservices architecture dan meningkatkan performa aplikasi hingga 40%.',
            'is_current_role' => true,
        ]);

        Experience::create([
            'portfolio_id' => $portfolio1->id,
            'company' => 'Startup Innovation',
            'position' => 'Frontend Developer',
            'start_date' => '2020-06-01',
            'end_date' => '2021-12-31',
            'description' => 'Mengembangkan user interface yang responsive dan user-friendly untuk berbagai aplikasi web. Berkolaborasi dengan tim design untuk implementasi UI/UX terbaik.',
            'is_current_role' => false,
        ]);

        // Add projects to portfolio 1
        Project::create([
            'portfolio_id' => $portfolio1->id,
            'title' => 'E-Commerce Platform',
            'description' => 'Platform e-commerce modern dengan fitur lengkap termasuk payment gateway, inventory management, dan analytics dashboard.',
            'image' => 'https://images.unsplash.com/photo-1554306274-f23873d9a26c?w=600',
            'technologies' => ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
            'live_url' => 'https://example-ecommerce.com',
            'github_url' => 'https://github.com/ahmadrizki/ecommerce-platform',
            'featured' => true,
        ]);

        // Add education to portfolio 1
        Education::create([
            'portfolio_id' => $portfolio1->id,
            'institution' => 'Universitas Indonesia',
            'degree' => 'Sarjana',
            'field' => 'Teknik Informatika',
            'start_date' => '2016-08-01',
            'end_date' => '2020-06-30',
            'gpa' => '3.7',
        ]);

        // Portfolio 2: UI/UX Designer
        $portfolio2 = Portfolio::create([
            'name' => 'Sari Dewi Lestari',
            'title' => 'UI/UX Designer',
            'email' => 'sari.dewi@email.com',
            'phone' => '+62 813-4567-8901',
            'location' => 'Bandung, Indonesia',
            'bio' => 'Creative UI/UX designer dengan passion untuk menciptakan pengalaman digital yang memorable. Berpengalaman dalam design thinking dan user research.',
            'profile_image' => 'https://images.unsplash.com/photo-1581065178026-390bc4e78dad?w=400',
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/saridewilestari',
                'dribbble' => 'https://dribbble.com/saridewi',
                'behance' => 'https://behance.net/saridewi'
            ]
        ]);

        // Add skills to portfolio 2
        $skills2 = ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'UI/UX Design'];
        foreach ($skills2 as $skillName) {
            $skill = Skill::where('name', $skillName)->first();
            if ($skill) {
                $portfolio2->skills()->attach($skill->id, ['proficiency_level' => rand(3, 5)]);
            }
        }

        // Add experience to portfolio 2
        Experience::create([
            'portfolio_id' => $portfolio2->id,
            'company' => 'Design Studio Creative',
            'position' => 'Senior UI/UX Designer',
            'start_date' => '2021-03-01',
            'end_date' => null,
            'description' => 'Memimpin design system untuk berbagai klien enterprise. Melakukan user research dan usability testing untuk meningkatkan conversion rate hingga 30%.',
            'is_current_role' => true,
        ]);

        // Add projects to portfolio 2
        Project::create([
            'portfolio_id' => $portfolio2->id,
            'title' => 'Banking Mobile App Redesign',
            'description' => 'Redesign aplikasi mobile banking dengan fokus pada user experience dan accessibility.',
            'image' => 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=600',
            'technologies' => ['Figma', 'Principle', 'User Research', 'Prototyping'],
            'live_url' => 'https://dribbble.com/shots/banking-app',
            'featured' => true,
        ]);

        // Add education to portfolio 2
        Education::create([
            'portfolio_id' => $portfolio2->id,
            'institution' => 'Institut Teknologi Bandung',
            'degree' => 'Sarjana',
            'field' => 'Desain Komunikasi Visual',
            'start_date' => '2015-08-01',
            'end_date' => '2019-06-30',
            'gpa' => '3.8',
        ]);

        // Portfolio 3: Data Scientist
        $portfolio3 = Portfolio::create([
            'name' => 'Budi Santoso',
            'title' => 'Data Scientist',
            'email' => 'budi.santoso@email.com',
            'phone' => '+62 814-5678-9012',
            'location' => 'Surabaya, Indonesia',
            'bio' => 'Data scientist dengan expertise dalam machine learning dan AI. Berpengalaman dalam menganalisis big data untuk mendrive business insights dan decision making.',
            'profile_image' => 'https://images.unsplash.com/photo-1622169804256-0eb6873ff441?w=400',
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/budisantoso',
                'github' => 'https://github.com/budisantoso',
                'kaggle' => 'https://kaggle.com/budisantoso'
            ]
        ]);

        // Add skills to portfolio 3
        $skills3 = ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'MySQL', 'Data Analysis'];
        foreach ($skills3 as $skillName) {
            $skill = Skill::where('name', $skillName)->first();
            if ($skill) {
                $portfolio3->skills()->attach($skill->id, ['proficiency_level' => rand(3, 5)]);
            }
        }

        // Add experience to portfolio 3
        Experience::create([
            'portfolio_id' => $portfolio3->id,
            'company' => 'Tech Analytics Corp',
            'position' => 'Senior Data Scientist',
            'start_date' => '2020-09-01',
            'end_date' => null,
            'description' => 'Membangun model prediktif untuk optimasi supply chain yang menghasilkan cost saving 25%. Memimpin tim data science untuk implementasi AI solutions.',
            'is_current_role' => true,
        ]);

        // Add projects to portfolio 3
        Project::create([
            'portfolio_id' => $portfolio3->id,
            'title' => 'Customer Churn Prediction Model',
            'description' => 'Model machine learning untuk prediksi customer churn dengan akurasi 92%. Implementasi menggunakan ensemble methods.',
            'image' => 'https://images.unsplash.com/photo-1554306274-f23873d9a26c?w=600',
            'technologies' => ['Python', 'Scikit-learn', 'Pandas', 'TensorFlow'],
            'github_url' => 'https://github.com/budisantoso/churn-prediction',
            'featured' => true,
        ]);

        // Add education to portfolio 3
        Education::create([
            'portfolio_id' => $portfolio3->id,
            'institution' => 'Institut Teknologi Sepuluh Nopember',
            'degree' => 'Magister',
            'field' => 'Statistika',
            'start_date' => '2016-08-01',
            'end_date' => '2018-06-30',
            'gpa' => '3.9',
        ]);

        Education::create([
            'portfolio_id' => $portfolio3->id,
            'institution' => 'Universitas Airlangga',
            'degree' => 'Sarjana',
            'field' => 'Matematika',
            'start_date' => '2012-08-01',
            'end_date' => '2016-06-30',
            'gpa' => '3.6',
        ]);
    }
}