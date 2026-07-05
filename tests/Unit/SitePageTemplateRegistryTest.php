<?php

namespace Tests\Unit;

use App\SitePages\SitePageTemplateRegistry;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class SitePageTemplateRegistryTest extends TestCase
{
    public function test_registry_exposes_expected_templates(): void
    {
        $options = SitePageTemplateRegistry::options();

        $this->assertArrayHasKey('about', $options);
        $this->assertArrayHasKey('homogeneous_group', $options);
        $this->assertArrayHasKey('church_structure', $options);
    }

    public function test_registry_rejects_unknown_template(): void
    {
        $this->expectException(InvalidArgumentException::class);

        SitePageTemplateRegistry::for('unknown-template');
    }
}
