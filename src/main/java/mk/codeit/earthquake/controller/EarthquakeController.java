package mk.codeit.earthquake.controller;

import lombok.RequiredArgsConstructor;
import mk.codeit.earthquake.model.Earthquake;
import mk.codeit.earthquake.service.EarthquakeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/earthquakes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EarthquakeController {

    private final EarthquakeService earthquakeService;

    @PostMapping("/fetch")
    public ResponseEntity<String> fetchAndStore() {
        earthquakeService.fetchAndStore();
        return ResponseEntity.ok("Earthquake data fetched and stored successfully.");
    }

    @GetMapping
    public ResponseEntity<List<Earthquake>> getAll() {
        return ResponseEntity.ok(earthquakeService.getAll());
    }

    @GetMapping("/filter/magnitude")
    public ResponseEntity<List<Earthquake>> getByMagnitude(
            @RequestParam Double minMag) {
        return ResponseEntity.ok(earthquakeService.getByMinMagnitude(minMag));
    }

    @GetMapping("/filter/time")
    public ResponseEntity<List<Earthquake>> getAfterTime(
            @RequestParam Long timestamp) {
        return ResponseEntity.ok(earthquakeService.getAfterTime(timestamp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        earthquakeService.deleteById(id);
        return ResponseEntity.ok("Deleted earthquake with id " + id);
    }
}