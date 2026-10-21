<?php
namespace Belleza\Patterns\Observer;

interface ObserverInterface {
    public function update(string $event, array $data): void;
}

interface SubjectInterface {
    public function attach(string $event, ObserverInterface $observer): void;
    public function detach(string $event, ObserverInterface $observer): void;
    public function notify(string $event, array $data): void;
}
