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
    private String time;
    private Double latitude;
    private Double longitude;

    private static final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("HH:mm")
                    .withZone(ZoneId.systemDefault());

    public static EarthquakeDTO fromEntity(Earthquake eq) {
        return new EarthquakeDTO(
                eq.getId(),
                eq.getTitle(),
                eq.getPlace(),
                eq.getMagnitude(),
                eq.getMagType(),
                eq.getTime() != null ? formatter.format(Instant.ofEpochMilli(eq.getTime())) : null,
                eq.getLatitude(),
                eq.getLongitude()
        );
    }
}