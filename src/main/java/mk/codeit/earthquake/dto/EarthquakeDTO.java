package mk.codeit.earthquake.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.codeit.earthquake.model.Earthquake;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EarthquakeDTO {

    private Long id;
    private String title;
    private String place;
    private Double magnitude;
    private String magType;
    private Long time;
    private Double latitude;
    private Double longitude;


    public static EarthquakeDTO fromEntity(Earthquake eq) {
        return new EarthquakeDTO(
                eq.getId(),
                eq.getTitle(),
                eq.getPlace(),
                eq.getMagnitude(),
                eq.getMagType(),
                eq.getTime(),
                eq.getLatitude(),
                eq.getLongitude()
        );
    }
}